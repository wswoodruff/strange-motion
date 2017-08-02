const React = require('react');
const T = require('prop-types');
const { debounce } = require('./utils');

class AccordianListItem extends React.PureComponent {

    static propTypes = {

        motionStyles: T.object,
        motionKey: T.string,
        setElementHeight: T.func,
        children: T.any
    }

    constructor(props) {

        super(props);
        this.setContainerRef = this._setContainerRef.bind(this);
        this.setContentRef = this._setContentRef.bind(this);
        this.debounceSetAutoAfterAnim = debounce(this._debounceSetAutoAfterAnim.bind(this), 50);
    }

    _setContainerRef(el) {

        this.container = el;
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

    render() {

        const { motionStyles, children } = this.props;

        this.debounceSetAutoAfterAnim();

        return (
            <div
                className='accordion-container'
                style={{ ...motionStyles, overflow: 'hidden', width: '100%' }} ref={this.setContainerRef}
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
}

module.exports = AccordianListItem;
