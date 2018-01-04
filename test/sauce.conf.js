const launchers = {}

const mobileLaunchers = [
	['iOS', '9.3', 'Safari', 'iPhone 6s Simulator'],
	['iOS', '10.3', 'Safari', 'iPhone 6s Simulator'],
	['iOS', '11.1', 'Safari', 'iPhone 6s Simulator'],
	['Android', '4.4', 'Browser', 'Android Emulator'],
	['Android', '5.1', 'Browser', 'Android Emulator'],
	['Android', '6.0', 'Chrome', 'Android Emulator'],
]

mobileLaunchers.forEach(([platform, version, browser, device]) => {
	const launcher = `sl_${platform}_${version}_${browser}`
		.replace(/[^a-z0-9]/gi, '_')
		.toLowerCase()

	launchers[launcher] = {
		name: `${browser}, ${platform} ${version}`,
		platformName: platform,
		platformVersion: version,
		browserName: browser,
		deviceName: device,
		deviceOrientation: 'portrait',
		appiumVersion: '1.7.1',
	}
})

const desktopLaunchers = [
	['Windows 8.1', 'Internet Explorer', '11.0'],
	['Windows 8', 'Internet Explorer', '10.0'],
	['macOS 10.12', 'Safari', '11.0'],
	['OS X 10.11', 'Safari', '10.0'],
	['OS X 10.11', 'Safari', '9.0'],
]

desktopLaunchers.forEach(([platform, browser, version]) => {
	const launcher = `sl_${platform}_${browser}_${version}`
		.replace(/[^a-z0-9]/gi, '_')
		.toLowerCase()

	launchers[launcher] = {
		name: `${browser} ${version}, ${platform}`,
		browserName: browser,
		version,
		platform,
	}
})

const evergreenLaunchers = ['Chrome', 'Firefox', 'MicrosoftEdge']

evergreenLaunchers.forEach(browser => {
	let pastVersions = 3
	do {
		pastVersions--
		let postfix = pastVersions > 0 ? `-${pastVersions}` : ''
		const version = 'latest' + postfix

		const browserName = browser === 'MicrosoftEdge' ? 'Edge' : browser
		const launcher = `sl_win10_${browser}_latest${postfix}`
			.replace(/-/g, '_')
			.toLowerCase()

		launchers[launcher] = {
			name: `${browserName} ${version}, Windows 10`,
			browserName: browser,
			version,
			platform: 'Windows 10',
		}
	} while (pastVersions)
})

for (const launcher in launchers) {
	launchers[launcher].base = 'SauceLabs'
}

module.exports = launchers
