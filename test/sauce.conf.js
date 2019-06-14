let launchers = {}

let mobileLaunchers = [
	['iOS', '10.3', 'Safari', 'iPhone 7 Simulator', '1.9.1'],
	['iOS', '11.3', 'Safari', 'iPhone 7 Simulator', '1.9.1'],
	['iOS', '12.2', 'Safari', 'iPhone 7 Simulator', '1.13.0'],
	['iOS', '13.0', 'Safari', 'iPhone 7 Simulator', '1.15.0'],
	['Android', '5.1', 'Browser', 'Android Emulator', '1.15.0'],
	['Android', '6.0', 'Chrome', 'Android Emulator', '1.15.0'],
	['Android', '8.0', 'Chrome', 'Android Emulator', '1.15.0']
]

for (let [platform, version, browser, device, appium] of mobileLaunchers) {
	let launcher = `sl_${platform}_${version}_${browser}`
		.replace(/[^a-z0-9]/gi, '_')
		.toLowerCase()

	launchers[launcher] = {
		name: `${browser}, ${platform} ${version}`,
		platformName: platform,
		platformVersion: version,
		browserName: browser,
		deviceName: device,
		deviceOrientation: 'portrait',
		appiumVersion: appium
	}
}

let desktopLaunchers = [
	['Windows 8.1', 'Internet Explorer', '11.0'],
	['Windows 8', 'Internet Explorer', '10.0'],
	['macOS 10.12', 'Safari', '11.0'],
	['OS X 10.11', 'Safari', '10.0'],
	['OS X 10.11', 'Safari', '9.0']
]

for (let [platform, browser, version] of desktopLaunchers) {
	let launcher = `sl_${platform}_${browser}_${version}`
		.replace(/[^a-z0-9]/gi, '_')
		.toLowerCase()

	launchers[launcher] = {
		name: `${browser} ${version}, ${platform}`,
		browserName: browser,
		version,
		platform
	}
}

for (let browser of ['Chrome', 'Firefox', 'MicrosoftEdge']) {
	let pastVersions = 3
	do {
		pastVersions--
		let postfix = pastVersions > 0 ? `-${pastVersions}` : ''
		let version = 'latest' + postfix

		let browserName = browser === 'MicrosoftEdge' ? 'Edge' : browser
		let launcher = `sl_win10_${browser}_latest${postfix}`.replace(/-/g, '_').toLowerCase()

		launchers[launcher] = {
			name: `${browserName} ${version}, Windows 10`,
			browserName: browser,
			version,
			platform: 'Windows 10'
		}
	} while (pastVersions)
}

for (let launcher in launchers) {
	launchers[launcher].base = 'SauceLabs'
}

module.exports = launchers
