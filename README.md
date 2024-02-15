# Nexperiment - A/B testing for React and Next.js

Nexperiment is a lightweight A/B testing solution for React and Next.js.
It has a straightforward API and leaves data collection and analysis to the user.

Once a website is configured with Nexperiment, it will randomly assign a version of each A/B test value to each user and store them in the local storage. This way, the user will always see the same version of each A/B test value, even if they refresh the page.

## Description

Each A/B test item consists of a key and an object with the A and B versions. When a key is requested, Nexperiment will randomly return the A or B version of the item (based on the content of the local storage) and a unique ID.

This ID can be used to dynamically set the ID of the HTML element that is being tested. The element can be the same as the one with the test content, but it is not a requirement.

## Installation

### NPM

```bash
npm install nexperiment
```

### Yarn

```bash
yarn add nexperiment
```

### PNPM

```bash
pnpm add nexperiment
```

## Usage

Add the `ABTestProvider` to one of your `layout.tsx` files. Provide the
`items` prop with an object of your A/B tests.

Optionally, you can provide a `prefix` prop to the `ABTestProvider` that
will be used as a prefix for the generated IDs.

### Parameters

- `items` (required): An object with the A/B tests.

```tsx
import { TestItems, ABTestProvider } from 'nexperiment';

const items: TestItems = {
  motto: {
    A: "Awesome motto for an awesome site",
    B: "A functional motto describing what the site does",
  },
  cta: {
    distribution: 0.5,
    A: "Let's go",
    B: "Read more",
  },
};
```

Setting the `distribution` property to a value between 0 and 1 will set the distribution of the A/B test. The default value is 0.5. In this case, 50%
of the users will see the A version, and 50% will see the B version.

- `prefix` (optional): A string that will be used as a prefix for the generated IDs. The default value is `ab-test-`.

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
	<ABTestProvider items={items} prefix="custom-prefix-">
  	  {children}
	</ABTestProvider>
  );
}
```

### Accessing a stored value

Use the `useABTest` hook to get the A/B test value and ID. Make sure to use the `useABTest` hook inside a component that is a child of the `ABTestProvider`.

```tsx
export default function HeroSection() {
	const abStore = useABTest();
	const cta = abStore.getItem('cta');

	return (
		<div>
			<button id={cta.id}>{cta.value}</button>
		</div>
	);
}
```

The above example tests the text of a button. By setting the provided ID to the button, the developer can differentiate between the A and B versions of the text. Considering that the default prefix is used, in this case, the ID of version A will be `ab-test-cta-A`, and the ID of version B will be `ab-test-cta-B`.

## Collecting data

Data collection and analysis are up to the user. However, the generated
IDs are designed to be easily usable with analytics tools.

Simply set up a custom event in your preferred analytics tool and listen for click events on elements with IDs that start with the prefix provided to the `ABTestProvider`.

## Author

Richard Kovacs

- [GitHub](https://github.com/kovrichard)
- [X / Twitter](https://twitter.com/rchardkovacs)
