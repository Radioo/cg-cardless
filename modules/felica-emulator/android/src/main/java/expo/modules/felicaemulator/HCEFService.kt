package expo.modules.felicaemulator

import android.nfc.cardemulation.HostNfcFService
import android.os.Bundle

class HCEFService : HostNfcFService() {

    companion object {
        // NFC-F command codes
        private const val CMD_POLLING = 0x04
        private const val CMD_READ_WITHOUT_ENCRYPTION = 0x06
        private const val CMD_REQUEST_SYSTEM_CODE = 0x0C

        // NFC-F response codes
        private const val RES_POLLING = 0x05
        private const val RES_READ_WITHOUT_ENCRYPTION = 0x07
        private const val RES_REQUEST_SYSTEM_CODE = 0x0D

        private const val BLOCK_SIZE = 16
    }

    override fun processNfcFPacket(commandPacket: ByteArray, extras: Bundle?): ByteArray {
        if (commandPacket.size < 10) return byteArrayOf()

        val commandCode = commandPacket[1].toInt() and 0xFF
        val idm = commandPacket.sliceArray(2..9)

        return when (commandCode) {
            CMD_POLLING -> handlePolling(idm)
            CMD_READ_WITHOUT_ENCRYPTION -> handleRead(commandPacket, idm)
            CMD_REQUEST_SYSTEM_CODE -> handleRequestSystemCode(idm)
            else -> byteArrayOf()
        }
    }

    override fun onDeactivated(reason: Int) {
        // No cleanup needed
    }

    private fun handlePolling(idm: ByteArray): ByteArray {
        // Response: LEN + RES_POLLING + IDm(8) + PMm(8)
        val pmm = ByteArray(8) { 0xFF.toByte() }
        val data = byteArrayOf(RES_POLLING.toByte()) + idm + pmm
        return byteArrayOf((data.size + 1).toByte()) + data
    }

    private fun handleRead(commandPacket: ByteArray, idm: ByteArray): ByteArray {
        // Parse number of blocks to read
        // Command format: LEN CMD IDm(8) ServiceCount(1) ServiceList(2*n) BlockCount(1) BlockList(...)
        if (commandPacket.size < 13) return byteArrayOf()

        val serviceCount = commandPacket[10].toInt() and 0xFF
        val blockCountOffset = 11 + (serviceCount * 2)
        if (commandPacket.size <= blockCountOffset) return byteArrayOf()

        val blockCount = commandPacket[blockCountOffset].toInt() and 0xFF

        // Build response with zero-filled blocks
        // Response: LEN + RES_READ + IDm(8) + StatusFlag1(1) + StatusFlag2(1) + BlockCount(1) + BlockData(16*n)
        val blockData = ByteArray(BLOCK_SIZE * blockCount)
        val data = byteArrayOf(RES_READ_WITHOUT_ENCRYPTION.toByte()) +
                idm +
                byteArrayOf(0x00, 0x00) + // Status flags: success
                byteArrayOf(blockCount.toByte()) +
                blockData
        return byteArrayOf((data.size + 1).toByte()) + data
    }

    private fun handleRequestSystemCode(idm: ByteArray): ByteArray {
        // Response: LEN + RES_REQUEST_SYSTEM_CODE + IDm(8) + NumSysCodes(1) + SystemCode(2)
        val data = byteArrayOf(RES_REQUEST_SYSTEM_CODE.toByte()) +
                idm +
                byteArrayOf(0x01) + // 1 system code
                byteArrayOf(0x40, 0x00) // System code 4000
        return byteArrayOf((data.size + 1).toByte()) + data
    }
}
