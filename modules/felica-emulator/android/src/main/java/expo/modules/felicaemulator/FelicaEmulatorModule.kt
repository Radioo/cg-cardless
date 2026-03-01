package expo.modules.felicaemulator

import android.content.ComponentName
import android.nfc.NfcAdapter
import android.nfc.cardemulation.NfcFCardEmulation
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class FelicaEmulatorModule : Module() {
    private var nfcAdapter: NfcAdapter? = null
    private var nfcFCardEmulation: NfcFCardEmulation? = null
    private var componentName: ComponentName? = null
    private var isEmulationActive = false
    private var currentIdm: String? = null
    private var currentSystemCode: String? = null

    private val context
        get() = appContext.reactContext

    private fun ensureInit() {
        if (nfcAdapter != null) return
        val ctx = context ?: return
        nfcAdapter = NfcAdapter.getDefaultAdapter(ctx)
        val adapter = nfcAdapter ?: return
        nfcFCardEmulation = NfcFCardEmulation.getInstance(adapter)
        componentName = ComponentName(ctx, HCEFService::class.java)
    }

    override fun definition() = ModuleDefinition {
        Name("FelicaEmulator")

        Function("isHceFSupported") {
            ensureInit()
            nfcFCardEmulation != null
        }

        Function("isNfcEnabled") {
            ensureInit()
            nfcAdapter?.isEnabled == true
        }

        Function("getStatus") {
            mapOf(
                "isEmulationActive" to isEmulationActive,
                "currentIdm" to (currentIdm ?: ""),
                "currentSystemCode" to (currentSystemCode ?: "")
            )
        }

        AsyncFunction("setIdm") { idm: String ->
            ensureInit()
            val emulation = nfcFCardEmulation
            val cn = componentName
            if (emulation == null || cn == null) {
                false
            } else {
                val result = emulation.setNfcid2ForService(cn, idm.uppercase())
                if (result) currentIdm = idm.uppercase()
                result
            }
        }

        AsyncFunction("setSystemCode") { code: String ->
            ensureInit()
            val emulation = nfcFCardEmulation
            val cn = componentName
            if (emulation == null || cn == null) {
                false
            } else {
                val result = emulation.registerSystemCodeForService(cn, code.uppercase())
                if (result) currentSystemCode = code.uppercase()
                result
            }
        }

        AsyncFunction("enableEmulation") {
            ensureInit()
            val emulation = nfcFCardEmulation
            val cn = componentName
            val activity = appContext.currentActivity
            if (emulation == null || cn == null || activity == null) {
                false
            } else {
                val result = emulation.enableService(activity, cn)
                if (result) isEmulationActive = true
                result
            }
        }

        AsyncFunction("disableEmulation") {
            ensureInit()
            val emulation = nfcFCardEmulation
            val activity = appContext.currentActivity
            if (emulation != null && activity != null) {
                emulation.disableService(activity)
                isEmulationActive = false
            }
        }
    }
}
