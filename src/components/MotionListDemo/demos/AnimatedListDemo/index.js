const React = require('react');
const T = require('prop-types');
const MotionList = require('../../../../../list');
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
        for(let i = 1; i < 11; ++i) {
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
                    // model={listItemData}
                >
                    {listItemData.map((item) => {

                        if (item.num % 3 === 1) {
                            return (
                                <RedRow
                                    key={item.num}
                                >
                                    {item.num}
                                    <XButton
                                        onClick={this.removeListItem(item)}
                                    />
                                </RedRow>
                            );
                        }
                        else if (item.num % 3 === 2) {
                            return (
                                <GreenRow
                                    key={item.num}
                                >
                                    {item.num}
                                    <XButton
                                        onClick={this.removeListItem(item)}
                                    />
                                </GreenRow>
                            );
                        }
                        else if (item.num % 3 === 0) {
                            return (
                                <BlueRow
                                    key={item.num}
                                >
                                    {item.num}
                                    <XButton
                                        onClick={this.removeListItem(item)}
                                    />
                                </BlueRow>
                            );
                        }
                    })}
                    {/* {({ child, key, style }) => {

                        if (child.num % 3 === 1) {
                            return (
                        <RedRow
                        key={child.num}
                        style={style}
                        >
                        {child.num}
                        <XButton
                        onClick={this.removeListItem(child)}
                        />
                        </RedRow>
                            );
                        }
                        else if (child.num % 3 === 2) {
                            return (
                        <GreenRow
                        key={child.num}
                        style={style}
                        >
                        {child.num}
                        <XButton
                        onClick={this.removeListItem(child)}
                        />
                        </GreenRow>
                            );
                        }
                        else if (child.num % 3 === 0) {
                            return (
                        <BlueRow
                        key={child.num}
                        style={style}
                        >
                        {child.num}
                        <XButton
                        onClick={this.removeListItem(child)}
                        />
                        </BlueRow>
                            );
                        }
                    }} */}
                </MotionList>
            </Wrapper>
        );
    }
};
