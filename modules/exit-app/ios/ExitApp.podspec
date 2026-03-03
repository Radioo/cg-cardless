require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExitApp'
  s.version        = package['version']
  s.summary        = package['name']
  s.description    = 'An Expo module to force-quit the app'
  s.author         = package['author']
  s.homepage       = 'https://github.com/expo/expo'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.swift'
end
