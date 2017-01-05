module.exports = {

	// Evergreen

	sl_chrome: {
		base: 'SauceLabs',
		browserName: 'chrome',
		platform: 'Windows 7',
	},

	sl_firefox: {
		base: 'SauceLabs',
		browserName: 'firefox',
	},

	sl_mac_safari: {
		base: 'SauceLabs',
		browserName: 'safari',
		platform: 'OS X 10.10',
	},

	// Internet Explorer

	sl_ie_10: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 8',
		version: '10',
	},

	sl_ie_11: {
		base: 'SauceLabs',
		browserName: 'internet explorer',
		platform: 'Windows 8.1',
		version: '11',
	},

	sl_edge: {
		base: 'SauceLabs',
		browserName: 'MicrosoftEdge',
		platform: 'Windows 10',
	},

	// Mobile

	sl_ios_8: {
		base: 'SauceLabs',
		browserName: 'iphone',
		version: '8.4',
	},

	sl_ios_9: {
		base: 'SauceLabs',
		browserName: 'iphone',
		version: '9.3',
	},

	// sl_android_4: {
	// 	base: 'SauceLabs',
	// 	browserName: 'android',
	// 	version: '4.2',
	// },

	sl_android_5: {
		base: 'SauceLabs',
		browserName: 'android',
		version: '5.1',
	},
}
