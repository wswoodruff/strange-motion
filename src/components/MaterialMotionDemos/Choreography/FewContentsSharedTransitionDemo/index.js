const React = require('react');
const T = require('prop-types');
const DemoView = require('components/DemoView');
const { default: Toolbar } = require('material-ui/Toolbar');
const { default: Paper } = require('material-ui/Paper');
const { default: Typography } = require('material-ui/Typography');
const MaterialFewContentsSharedCardTransition = require('../../../../../components/MaterialFewContentsSharedCardTransition');
const MountMotion = require('../../../../../mount');

const Axios = require('axios');

// Styles

const lStyles = require('./styles');

const {
    AppBar,
    GithubUserContainer,
    GithubUsersContainer,
    Avatar,
    SharedContentsContainer,
    DetailContentsContainer,
    GithubUserName } = lStyles;

// Anims

const lAnims = require('./anims');

const { FadeAnim } = lAnims;

// Component

module.exports = class FewContentsSharedTransitionDemo extends React.PureComponent {

    static propTypes = {
        animPlugins: T.array
    };

    static defaultProps = {
        animPlugins: []
    }

    constructor(props) {

        super();

        this.state = {
            inDetailView: false,
            githubUsers: [],
            transitionStates: {}
        }

        this.setRef = this._setRef.bind(this);
        this.onCardTransitionStateChange = this._onCardTransitionStateChange.bind(this);
    }

    componentWillMount() {

        const githubUsers = [{
            login: 'wswoodruff',
            avatar_url: 'https://avatars1.githubusercontent.com/u/9013245?v=4',
            url: 'https://api.github.com/users/wswoodruff',
            name: 'william woodruff',
            company: '@BigRoomStudios',
            location: 'Maine',
            email: null,
            bio: 'react, react-native, hapi, node.js =P',
            public_repos: 51,
            public_gists :1,
            followers: 6,
            following:6
        }];

        githubUsers.push(Object.assign({},
            githubUsers[0],
            { login: 'wswoodruff1' }
        ));
        githubUsers.push(Object.assign({},
            githubUsers[0],
            { login: 'wswoodruff2' }
        ));
        githubUsers.push(Object.assign({},
            githubUsers[0],
            { login: 'wswoodruff3' }
        ));
        githubUsers.push(Object.assign({},
            githubUsers[0],
            { login: 'wswoodruff4' }
        ));
        githubUsers.push(Object.assign({},
            githubUsers[0],
            { login: 'wswoodruff5' }
        ));
        githubUsers.push(Object.assign({},
            githubUsers[0],
            { login: 'wswoodruff6' }
        ));
        githubUsers.push(Object.assign({},
            githubUsers[0],
            { login: 'wswoodruff7' }
        ));

        this.setState({
            githubUsers
        });

        this.setTransitionContainer = function (ref) {

            this['transitionContainer'] = ref;
        };

        this.bindSetTransitionContainer = (elToBind) => {

            this.setTransitionContainer = this.setTransitionContainer.bind(elToBind);
        }

        // Use axios to get contributor profiles

        // Axios.get('https://api.github.com/users/wswoodruff')
        // .then((res) => {
        //
        //     console.log(JSON.stringify(res.data));
        //
        //     this.setState({
        //         githubUsers: [].concat(res.data)
        //     })
        // });
    };

    _setRef(refName) {

        return (ref) => {

            this[refName] = ref;

            if (refName === 'transitionContainer') {
                this.setTransitionContainer(ref);
            }
        }
    }

    _onCardTransitionStateChange(key) {

        (newTransitionState) => {

            const { transitionStates } = this.state;
            transitionStates[key] = newTransitionState;

            this.setState({
                transitionStates
            });
        }
    }

    render() {

        // Few or no content elements are shared
        // from this page https://material.io/guidelines/motion/choreography.html#choreography-continuity

        const {
            inDetailView,
            githubUsers,
            transitionStates } = this.state;

        // TODO replace inDetailView with transitionStates[key] === 'detail'

        return (
            <DemoView>
                <AppBar>
                    <Toolbar>
                        {inDetailView && (
                            <div></div>
                        )}
                        <Typography type='title'>
                            Github Profiles
                        </Typography>
                    </Toolbar>
                </AppBar>

                <GithubUsersContainer>

                    {githubUsers.map((githubUser) => {

                        return (
                            <GithubUserContainer
                                key={githubUser.login}
                                innerRef={this.setRef('transitionContainer')}>
                                <MaterialFewContentsSharedCardTransition
                                    onTransitionStateChange={this.onCardTransitionStateChange(githubUser.login)}
                                    transitionContainer={GithubUsersContainer}
                                    bindSetTransitionContainer={this.bindSetTransitionContainer}
                                    sharedContents={
                                        <SharedContentsContainer>
                                            <MountMotion
                                                animConfig={FadeAnim}>
                                                <Avatar
                                                    src={githubUser.avatar_url}
                                                    key='avatar'
                                                />
                                                <GithubUserName
                                                    key='username'>
                                                    {githubUser.login}
                                                </GithubUserName>
                                            </MountMotion>
                                        </SharedContentsContainer>
                                    }
                                    detailContents={
                                        <DetailContentsContainer>
                                            Hello! loL
                                        </DetailContentsContainer>
                                    }
                                />
                            </GithubUserContainer>
                        );
                    })}
                </GithubUsersContainer>
            </DemoView>
        );
    }
};
