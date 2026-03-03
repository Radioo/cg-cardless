import ExpoModulesCore

public class ExitAppModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExitApp")

        Function("exitApp") {
            exit(0)
        }
    }
}
