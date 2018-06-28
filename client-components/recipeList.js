import React from 'react';
import axios from 'axios';
<<<<<<< HEAD
import { Text, View, FlatList, ActivityIndicator } from 'react-native';

import RecipeListEntry from './recipeListEntry';
import Recipe from './recipe';
import {styles} from '../styles';

=======
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Animated } from 'react-native';

import RecipeListEntry from './recipeListEntry'
import Recipe from './recipe'
>>>>>>> 01554cdf89f2afb47a19f608c2a3db746c9553e5
import IP from '../IP';

import Ionicons from 'react-native-vector-icons/Ionicons';




//====================================================
class RecipeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRecipe: undefined,
      fadeAnim: new Animated.Value(0)
    };
    this.selectRecipe = this.selectRecipe.bind(this);
    this.recipeBack = this.recipeBack.bind(this);
  }

  static navigationOptions = {
    tabBarColor: 'blue',
    tabBarIcon: () => {
      return <Ionicons name='ios-list' size={25} color='white' />;
    },

  }
  //====================================================
  componentDidMount() {
    this.findRecipes();
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 60000,
      }
    ).start();
  }

  //====================================================
  findRecipes() {
    axios.post(`http://${IP}/api/recipelist`, this.props.screenProps.ingredients).then((results) => {
      this.setState({
        recipes: results.data
      });
    });
  }

  selectRecipe(recipe) {
    this.setState({
      selectedRecipe: recipe
    });
  }

  recipeBack() {
    this.setState({
      selectedRecipe: undefined
    });
  }
  //====================================================
  render() {

    let { fadeAnim } = this.state;

    if (!this.state.selectedRecipe) {
      if (this.state.recipes) {
        return (
          <View style={styles.container}>
            <Animated.View
              style={{ ...this.props.style, opacity: fadeAnim }}
            >

              <Text>Here are some Recipes</Text>
              <FlatList style={styles.list}
                data={this.state.recipes}
                renderItem={
                  ({ item }) => (
                    <View>
                      <RecipeListEntry
                        recipe={item}
                        selectRecipe={this.selectRecipe}
                      />
                    </View>
                  )
                }
                keyExtractor={(item, index) => item.id.toString()}
              />
            </Animated.View>
          </View>
        );
      } else {
        return (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="gray" />
          </View>
        );
      }
    } else {
      return (
        <Recipe selectedRecipe={this.state.selectedRecipe} email={this.props.screenProps.email} recipeBack={this.recipeBack} />
      );
    }
  }
}
//====================================================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'powderblue',
//     alignItems: 'center',
//     paddingTop: 20,
//     // justifyContent: 'center',
//   },
//   list: {
//     flex: 1,
//     backgroundColor: 'white'
//     // justifyContent: 'center',
//   },
//   spinner: {
//     flex: 1,
//     justifyContent: 'center'
//   }
// });

export default RecipeList;

