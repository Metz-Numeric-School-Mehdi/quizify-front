/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [],
	theme: {
		fontWeight: {
			normal: '400',
			medium: '500',
			semibold: '600',
			bold: '700'
		},
		fontSize: {
			title: '1.875rem', // 3xl
			subtitle: '1.5rem', // 2xl
			legend: '1.25rem', // xl
			body: '1rem', // base
			small: '0.875rem', // sm
			xsmall: '0.75rem', // xs
			'2xsmall': '0.625rem', // 2xs
			'3xsmall': '0.5rem' // 3xs
		},
		borderRadius: {
			full: '9999px',
			'2xl': '1rem', // 16px
			xl: '0.875rem', // 14px
			lg: '0.75rem', // 12px
			md: '0.5rem', // 8px
			sm: '0.25rem', // 4px
			xs: '0.125rem' // 2px
		},
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				"primary-linear": 'hsl(var(--primary-linear))',
				"secondary-linear": 'hsl(var(--secondary-linear))',
				"text-color": 'hsl(var(--text-color))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					background: 'hsl(var(--background))',
					foreground: 'hsl(var(--foreground))',
					primary: 'hsl(var(--primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--accent))',
					'accent-foreground': 'hsl(var(--accent-foreground))',
					border: 'hsl(var(--border))',
					ring: 'hsl(var(--ring))'
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
