# API

### Components
These are helper components accessible via `require('strange-motion/motion);` -- lowercased name of the component
- **`Motion`** Base component that accepts an `animConfig`
- **`Mount`** Uses `react-motion`'s `TransitionMotion` component to handle anims for entering and exiting
- **`Multi`** Accepts a special animConfig to control multiple `Motion` components
- **`Toggle`** A vanity component to make it easy to animate between 2 elements, hiding / showing as a toggle button would do.

### AnimConfig
The same rules apply to animConfigs across strange-motion components, with the exception of the `Multi` component.
There are special keys that make animConfigs extra useful! You should know about them.

- **`start`** Styles to be applied before the animation starts, a start-point for the anim. _Note: start is not allowed to have any stiffness or damping settings set on it_
- **`enter`** Styles to animate towards immediately on mount
- **`leave`** Styles to animate towards when unmounting
- **`$delay`** A delay to offset the entire animation by

This animConfig will animate something from 0x0 to 40x40 on mount, then animate back to 0x0 when leaving IF you use the Mount component. Motion components do not respond to the `leave` setting by default.
```js
// Ex. animConfig
const animConfig = {
    start: {
        width: 0,
        height: 0
    },
    enter: {
        width: 40,
        height: 40
    },
    leave: {
        width: 0,
        height: 0
    }
}
```
If you update the `animConfig`, strange-motion components will pick up on that and update it's internals. If you update the `enter` setting on the animConfig, the component will animate immediately to whatever the new `enter` setting is.

### Tuning Anims
Css props in your animConfig can either be set to the target value or an object containing some more information.
There are special properties that css props can be set to in your animConfigs that you should know about!

- **`val`** This is where your target value goes when using an object for a css prop.
- **`preset`** This allows you to reference react-motion's presets `noWobble (default anim), gentle, wobbly, and stiff`.
- **`stiffness`** React-motion's stiffness setting. This correlates somewhat with the anim's speed.
- **`damping`** React-motion's damping setting. This correlates somewhat with the anim's springyness.
- **`$delay`** Delay just this prop's anim

Ex:
```js
const animConfig = {
    start: {
        width: 0,
        height: 0
    },
    enter: {
        width: {
            val: 40,
            stiffness: 10,
            damping: 20,
            preset: 'wobbly'
        }
        height: {
            val: 40,
            $delay: 200
        }
    }
}
```

### Named Anims
Add extra props to your animConfigs for named anims you can use with the `animController`, which we'll talk about next.
Ex:
```js
const animConfig = {
    start: {
        width: 0,
        height: 0
    },
    enter: {
        width: 40,
        height: 40
    },
    large: {
        width: 60,
        height: 60
    },
    xLarge: {
        width: 80,
        height: 80
    }
};
```

### Anim Controller
On all `strange-motion` components, an animController is generated with an API built for your animConfig. You get the animController like so:
```js
const animConfig = { ... };
const setRef = (ref) => { this.animController = ref };
...
<Motion
    animConfig={animConfig}
    getAnimController={setRef}
>
    <div>Animate me!</div>
</Motion>
```

Once you've obtained the animController, you can use its API to control animations
AnimControll API:
- **`play`** Animate to the passed-in CSS props. This will update the animConfig's `enter` setting to the passed-in props.
