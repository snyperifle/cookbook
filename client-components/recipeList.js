import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Animated, Modal, ImageBackground, Dimensions, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements'

import { styles } from '../styles'
import RecipeListEntry from './recipeList-components/recipeListEntry'
import Recipe from './recipeList-components/recipe'

import Ionicons from 'react-native-vector-icons/Ionicons';
//====================================================
class RecipeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      recipeListIndex: this.props.screenProps.recipeListIndex,
      selectedRecipe: undefined,
      fadeAnim: new Animated.Value(0),
      showRecipe: false,
      rows: Dimensions.get('window').width < Dimensions.get('window').height ? 2 : 4,
      refreshing: false
    };
    this.selectRecipe = this.selectRecipe.bind(this);
    this.recipeBack = this.recipeBack.bind(this);
  }

  static navigationOptions = {
    tabBarColor: 'mediumblue',
    tabBarIcon: () => {
      return <Ionicons name='ios-restaurant' size={25} color='white' />;
    },
    tabBarOnPress: ({ navigation }) => {
      navigation.navigate('Recipes');
      let { recipes, searchRecipes } = navigation.getScreenProps();
      if (!recipes) {
        searchRecipes();
      }
    }
  }
  //====================================================
  componentDidMount() {
    Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 1000, }).start();
  }
  //====================================================
  onRefresh() {
    this.props.screenProps.getIngredients().then(() => {
      this.props.screenProps.searchRecipes();
    });
    this.props.screenProps.getUserRecipes();
    this.props.screenProps.getUserGroceries();
    this.setState({ refreshing: false });
  }

  selectRecipe(recipe) {
    this.setState({
      selectedRecipe: recipe,
      showRecipe: true
    });
  }

  recipeBack() {
    this.setState({
      selectedRecipe: undefined,
      showRecipe: false
    });
  }
  //====================================================
  render() {
    if (Array.isArray(this.props.screenProps.recipes) && this.props.screenProps.recipes.length) {
      return (
        <ImageBackground
          style={[styles.container, {
            backgroundColor: 'white',
            justifyContent: 'center'
          }]}
          source={require('../media/4.jpg')}
          blurRadius={0}
          onLayout={() => {
            // console.log('Rotated');
            Dimensions.get('window').width < Dimensions.get('window').height ? this.setState({ rows: 2 }) : this.setState({ rows: 4 })
            this.forceUpdate();
          }}
        >
          <SearchBar
            platform="android"
            containerStyle={{ width: Dimensions.get('window').width }}
            onClear={() => { this.props.screenProps.searchRecipes() }}
            onChangeText={(text) => { this.setState({ searchText: text }) }}
            onSubmitEditing={() => { this.props.screenProps.searchRecipes({ ingredients: this.state.searchText }) }}
            placeholder='Search recipes by ingredients' />
          <FlatList
            key={this.state.rows}
            data={this.props.screenProps.recipes}
            extraData={this.state.recipeListIndex}
            renderItem={
              ({ item }) => (
                <View style={{ padding: 5, }}>
                  <RecipeListEntry recipe={item} selectRecipe={this.selectRecipe} ingredients={this.props.screenProps.ingredients} />
                </View>
              )
            }
            keyExtractor={(item) => item.id.toString()}
            numColumns={this.state.rows}
            initialNumToRender={12}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh()}
                colors={['orange']}
                progressBackgroundColor='transparent'
              />
            }
          />
          <Modal
            animationType="slide"
            visible={this.state.showRecipe}
            onRequestClose={() => {
              this.setState({
                showRecipe: false
              })
            }}>
            <Recipe selectedRecipe={this.state.selectedRecipe} email={this.props.screenProps.email} recipeBack={this.recipeBack} getUserRecipes={this.props.screenProps.getUserRecipes} getIngredients={this.props.screenProps.getIngredients} ingredients={this.props.screenProps.ingredients} getUserGroceries={this.props.screenProps.getUserGroceries} searchRecipes={this.props.screenProps.searchRecipes} />
          </Modal>
        </ImageBackground>
      );
    } else if (Array.isArray(this.props.screenProps.recipes) && !this.props.screenProps.recipes.length) {
      return (
        <ImageBackground
          style={[styles.container, {
            backgroundColor: 'white',
            justifyContent: 'center',
          }]}
          source={require('../media/4.jpg')}
          blurRadius={0}
        >
          <SearchBar
            platform="android"
            containerStyle={{ width: Dimensions.get('window').width }}
            onClear={() => { this.props.screenProps.searchRecipes() }}
            onChangeText={(text) => { this.setState({ searchText: text }) }}
            onSubmitEditing={() => { this.props.screenProps.searchRecipes({ ingredients: this.state.searchText }) }}
            placeholder='Search recipes by ingredients' />
          <Text
            style={{
              paddingTop: 15,
              flex: 1,
              // justifyContent: 'center',
              fontSize: 17,
              width: Dimensions.get('window').width * 0.85
            }}
          >Search for recipes or add ingredients to pantry to automatically generate recipes.</Text>
        </ImageBackground>
      );
    } else {
      return (
        <ImageBackground
          style={[styles.container, {
            backgroundColor: 'white',
            justifyContent: 'center'
          }]}
          source={require('../media/4.jpg')}
          blurRadius={0}
        >
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="orange" />
            {/* <Image source={require('../media/loading.gif')}/> */}
          </View>
        </ImageBackground>
      );
    }
  }
}

export default RecipeList;

