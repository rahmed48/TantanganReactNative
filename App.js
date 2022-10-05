import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import axios from "axios";

export default function App() {
  const [item, setItem] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  console.log(item);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    axios
      .get(`https://dev-dummy-api.jelantah.org/api/foods/get`, {
        signal: signal,
      })
      .then((response) => {
        if (response.data.status == 200) {
          setItem(response.data.data.data);
          setLoading(false);
        } else {
          alert("Data Tidak Ditemukan");
        }
      })
      .catch((err) => alert(err.message));

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    axios
      .get(`https://dev-dummy-api.jelantah.org/api/foods/get`)
      .then((response) => {
        if (response.data.status == 200) {
          setItem(response.data.data.data);
          setRefreshing(false);
        } else {
          alert("Data Tidak Ditemukan");
        }
      })
      .catch((err) => alert(err.message));
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderContainer}>
        <View style={styles.itemContainer}>
          <Image
            style={styles.image}
            resizeMode={"cover"}
            source={{
              uri: `${item.url_image_absolute}`,
            }}
          />
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>{item.food_name}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Tantangan React Native</Text>
      <FlatList
        data={item}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: "space-around" }}
        numColumns={2}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  renderContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  itemText: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemContainer: {
    height: 140,
    width: 140,
    marginBottom: 25,
    backgroundColor: "#858585",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000000",
  },
  image: { width: "100%", height: "100%", borderRadius: 15 },
  blackContainer: {
    width: "100%",
    height: "35%",
    position: "absolute",
    bottom: 0,
    borderRadius: 15,
    justifyContent: "center",
    opacity: 0.6,
    backgroundColor: "#000000",
  },
  textContainer: {
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
  },
  text: {
    fontSize: 13,
    paddingHorizontal: 12,
    color: "#000000",
  },
});
