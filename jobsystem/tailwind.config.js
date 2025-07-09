/** @type {import('tailwindcss').Config} */

const zincColors = {
	100: '#f4f4f5',
	200: '#e4e4e7',
	300: '#d4d4d8',
	400: '#a1a1aa',
	500: '#71717a',
	600: '#52525b',
	700: '#3f3f46',
	800: '#27272a',
	900: '#18181b',
	950: '#09090b',
};

const hexOpacity = (opacity) => {
	const opacityMap = {
		'0': '00', '5': '0D', '10': '1A', '15': '26', '20': '33', '25': '40',
		'30': '4D', '35': '59', '40': '66', '45': '73', '50': '80', '55': '8C',
		'60': '99', '65': 'A6', '70': 'B3', '75': 'BF'
	};
	return opacityMap[opacity];
};

const generateGridBackgrounds = (colors) => {
	const backgrounds = {};
	Object.keys(colors).forEach((key) => {
		const color = colors[key];
		backgrounds[`grid-zinc-${key}`] = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='${encodeURIComponent(color)}'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`;

		[0, 5, 10, 15, 20, 25, 50, 75].forEach((opacity) => {
			const colorWithOpacity = color + hexOpacity(String(opacity));
			backgrounds[`grid-zinc-${key}/${opacity}`] = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='${encodeURIComponent(colorWithOpacity)}'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`;
		});
	});
	return backgrounds;
};

module.exports = {
	mode: 'jit',
	darkMode: ["class"],
	safelist: ["dark"],
	important: true,
	content: [
		'./pages/**/*.{ts,tsx,js,jsx}',
		'./components/**/*.{ts,tsx,js,jsx}',
		'./app/**/*.{ts,tsx,js,jsx}',
		'./src/**/*.{ts,tsx,js,jsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: 'true',
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			}
		},
		extend: {
			backgroundImage: 'generateGridBackgrounds(zincColors)',
			fontFamily: {
				sans: ["Geist Variable", "sans-serif"],
				mono: ["Geist Mono", "monospace"],
			},
			fontSize: {
				"tiny": "11px",
				"base": "15px",
				"des": "13px",
			},
			colors: {
				zinc: {
					'925': '#131316'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: {
					DEFAULT: 'hsl(var(--background))',
					alt: 'hsl(var(--background-alt))'
				},
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				heading: {
					DEFAULT: 'hsl(var(--heading))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					alt: 'hsl(var(--card-alt))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				'pulse-bg': {
					'0%, 100%': {
						backgroundColor: 'transparent',
						color: 'hsl(var(--muted-foreground))'
					},
					'50%': {
						backgroundColor: 'hsl(var(--secondary))',
						color: 'hsl(var(--primary))'
					}
				}
			},
			animation: {
				"accordion-down": "accordion-down 1ms ease-out forwards",
				"accordion-up": "accordion-up 300ms ease-out forwards",
				fadeIn: 'fadeIn 0.2s ease-in forwards',
				'pulse-bg': 'pulse-bg 1.5s ease-in-out 4'
			},
		}
	},
	plugins:
		[require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		function ({ addUtilities }) {
			const maskImageUtilities = {
				'.mask-gradient-transparent-to-black': {
					'mask-image': 'linear-gradient(transparent, black)',
				},
				'.mask-gradient-transparent-to-black-to-transparent': {
					'mask-image': 'linear-gradient(transparent, black, transparent)',
				},
				'.mask-gradient-black-to-transparent': {
					'mask-image': 'linear-gradient(black, transparent)',
				},
			};
			addUtilities(maskImageUtilities, ['responsive', 'hover', 'dark']);
		}],
	safelist: [
		{
			pattern: /bg-(red|pink|rose|indigo|emerald|orange|yellow|green|cyan|blue|purple|zinc)-(50|100|200|300|400|500|600|700|800|900|950)/,
		},
		{
			pattern: /border-(red|pink|rose|indigo|emerald|orange|yellow|green|cyan|blue|purple|zinc)-700/,
		},
	],
}