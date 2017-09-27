const launchers = {}

const mobileLaunchers = [
	['iOS', '8.4', 'Safari', 'iPhone 6 Simulator'],
	['iOS', '9.3', 'Safari', 'iPhone 6s Simulator'],
	['iOS', '10.3', 'Safari', 'iPhone 6s Simulator'],
	['Android', '4.4', 'Browser', 'Android Emulator'],
	['Android', '5.0', 'Browser', 'Android Emulator'],
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
		appiumVersion: '1.6.4',
	}
})

const desktopLaunchers = [
	['Windows 8.1', 'Internet Explorer', '11.0'],
	['Windows 8', 'Internet Explorer', '10.0'],
	['macOS 10.12', 'Safari', '10.0'],
	['OS X 10.11', 'Safari', '9.0'],
	['OS X 10.10', 'Safari', '8.0'],
	['OS X 10.9', 'Safari', '7.0'],
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
	let browserName = browser

	if (browser === 'MicrosoftEdge') {
		pastVersions = 2
		browserName = 'Edge'
	}

	while (pastVersions >= 0) {
		let postfix = pastVersions > 0 ? `-${pastVersions}` : ''
		const version = 'latest' + postfix

		const launcher = `sl_win10_${browser}_latest${postfix}`
			.replace(/-/g, '_')
			.toLowerCase()

		launchers[launcher] = {
			name: `${browserName} ${version}, Windows 10`,
			browserName: browser,
			version,
			platform: 'Windows 10',
		}

		pastVersions--
	}
})

for (const launcher in launchers) {
	launchers[launcher].base = 'SauceLabs'
}

module.exports = launchers
