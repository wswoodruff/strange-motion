const React = require('react');
const T = require('prop-types');
const { debounce } = require('../utils');

module.exports = class AccordianListItem extends React.PureComponent {

    static propTypes = {
        motionStyles: T.object,
        motionKey: T.string,
        setElementHeight: T.func,
        children: T.any
    }

    constructor(props) {

        super(props);
        this.setContentRef = this._setContentRef.bind(this);
        this.debounceSetAutoAfterAnim = debounce(this._debounceSetAutoAfterAnim.bind(this), 50);
        this.setRef = this._setRef.bind(this);
    }

    _setContentRef(el) {

        const { motionKey, setElementHeight } = this.props;

        this.content = el;
        if (el && el.clientHeight) {

            setElementHeight(motionKey, this.content.clientHeight);
        }
    }

    _debounceSetAutoAfterAnim() {

        if (this.container) {
            this.container.style.height = 'auto';
        }
    }

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        }
    }

    render() {

        const { motionStyles, children } = this.props;

        this.debounceSetAutoAfterAnim();

        return (
            <div
                className='accordion-container'
                style={{
                    ...motionStyles,
                    overflow: 'hidden',
                    width: '100%'
                }}
                ref={this.setRef('container')}
            >
                <div
                    className='accordion-content'
                    ref={this.setContentRef}
                >
                    {children}
                </div>
            </div>
        );
    }
};
