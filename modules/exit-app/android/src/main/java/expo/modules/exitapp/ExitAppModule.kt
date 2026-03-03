package expo.modules.exitapp

import android.app.Activity
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExitAppModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExitApp")

        Function("exitApp") {
            val activity: Activity? = appContext.currentActivity
            activity?.finishAndRemoveTask()
            android.os.Process.killProcess(android.os.Process.myPid())
            System.exit(0)
        }
    }
}
