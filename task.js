import React, { Component } from "react";
import { getUsers, getOrganizations } from "./api";

class App extends Component {
  state = {
    loading: true,
    // Changed initial selectedOrg state to false
    // so there is only 2 states, id or false, and
    // we can make exact comparison for presence
    selectedOrg: false,
    // Need to move users and organizations to the state,
    // because if it outside and changes, then component DOES not rerenders;
    users: [],
    organizations: []
  };

  async componentDidMount() {
    // 1. We can run getOrganization and getUsers paralelly,
    //    if they do not depend on each other
    //    This is needed so spend less time to content downloading
    // 2. Added catch for error cases. Because if promise rejected then
    // 3. our app may break

    try {
      // we first run both request paralelly
      const fetchUsers = getUsers();
      const fetchOrganizations = getOrganizations();

      //then we wait them.
      const users = await fetchUsers;
      const organizations = await fetchOrganizations;

      //when both have been gotten we can submit it to state and change loading state

      this.setState({ users, organizations, loading: false });
    } catch (error) {
      // we need to handle error case, so our app does not breaks
      this.setState({ loading: false }); // we can add error state {error: true}
      console.log(error?.message);
    }
  }

  // just changed org to orgId, so it clearer
  selectOrg = (orgId) => {
    this.setState({ selectedOrg: orgId });
  };

  resetSelectedOrg = () => {
    this.setState({ selectedOrg: false });
  };

  render() {
    if (this.state.loading) {
      return "Loading...";
    }

    let users = [];

    // Moved first for loop in to the else statement, just do not do the double work
    // before that first loop run every time,
    // and if there is selectedOrg then is swiped, waste of resources

    // we changed selectedOrg from name to id, but here might be other
    // problem, 0 which is id and which is falsy value,
    // so changed comparison to exact false state
    if (this.state.selectedOrg !== false) {
      // deleted finding orgId step, aslo that step was inefficient, because it was inside
      // loop and run on every single loop iteration,

      const orgId = this.state.selectedOrg;
      //Here is spelling error organizaITOn, i did not touch it
      const usersFilteredByOrg = this.state.users.filter(
        (user) => user.organizaiton === orgId
      );

      users = usersFilteredByOrg.map((user) => {
        return (
          <div className="user-list-item" key={user.id}>
            <div>name: {user.name}</div>
            <div>org: {orgId}</div>
          </div>
        );
      });
    } else {
      // 1. we dont need to search organization name, we can
      //    put id instead of name, then search by id as well
      // 2. we can use map instead of for loop, to make it neat
      // 3. added key to the list, so react can distinct items in the list;

      users = this.state.users.map((user) => {
        const { name, organizaiton: orgId } = user;
        return (
          <div className="user-list-item" key={user.id}>
            <div>name: {name}</div>
            <div onClick={() => this.selectOrg(orgId)}>org: {orgId}</div>
          </div>
        );
      });
    }

    // 1. the comparison changed inside return statement.
    //    because 0(id) is falsy value
    // 2. to the onClick we can put the resetSelectedOrg
    //    without wrapping to other func
    return (
      <div>
        {this.state.selectedOrg !== false && (
          <button onClick={this.resetSelectedOrg}>reset selected org</button>
        )}
        <div className="user-list">{users}</div>
      </div>
    );
  }
}

export default App;
