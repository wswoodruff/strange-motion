const React = require('react');
const T = require('prop-types');
const MotionList = require('../../../../../motionList');
const DemoView = require('components/DemoView');

// Styles

const lStyles = require('./styles');

const {
    Wrapper,
    RedRow,
    GreenRow,
    BlueRow,
    XButton } = lStyles;

// Anims

const lAnims = require('./anims');

const { RowAnim } = lAnims;

// Component

module.exports = class AnimatedListDemo extends React.PureComponent {

    constructor(props) {

        super();

        let listItemData = [];
        for(let i = 1; i < 101; ++i) {
            listItemData.push({
                num: i
            });
        }

        this.state = {
            animConfig: RowAnim,
            listItemData
        };

        this.removeListItem = this._removeListItem.bind(this);
    }

    _removeListItem(itemNumber) {

        return () => {

            const { listItemData } = this.state;
            const newListItemData = listItemData.slice(0, listItemData.indexOf(itemNumber))
            .concat(listItemData.slice(listItemData.indexOf(itemNumber) + 1));

            console.log(listItemData.length);
            console.log(newListItemData.length);
            if (newListItemData.length !== (listItemData.length - 1)) {
                throw new Error('its happening in this stupid func');
            }

            this.setState({
                listItemData: newListItemData
            });
        }
    }

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        }
    }

    render() {

        const {
            animConfig,
            listItemData } = this.state;

        return (
            <Wrapper>
                <MotionList
                    animConfig={animConfig}
                    model={listItemData}
                >
                    {(style, data, key) => {

                        if (data.num % 3 === 1) {
                            return (
                                <RedRow
                                    style={style}
                                >
                                    {data.num}
                                    <XButton
                                        onClick={this.removeListItem(data)}
                                    />
                                </RedRow>
                            );
                        }
                        else if (data.num % 3 === 2) {
                            return (
                                <GreenRow
                                    style={style}
                                >
                                    {data.num}
                                    <XButton
                                        onClick={this.removeListItem(data)}
                                    />
                                </GreenRow>
                            );
                        }
                        else if (data.num % 3 === 0) {
                            return (
                                <BlueRow
                                    style={style}
                                >
                                    {data.num}
                                    <XButton
                                        onClick={this.removeListItem(data)}
                                    />
                                </BlueRow>
                            );
                        }
                    }}
                </MotionList>
            </Wrapper>
        );
    }
};
