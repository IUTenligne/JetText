//     ____    ____
//      /__ _/_ /_\   _/_
//     //_  /  //_ \/ /
// /__/ \__/_ / \__/\/_
//  
// views
// |-containers
// | |-index

class ContainersIndex extends App {
  render() {
    console.log("containers/index"); //file
  }
}

class ContainersIndexPart extends ContainersIndex {
  testTry() {
    console.log("index-view-part");
  }
}