import React from 'react';
import {connect} from 'react-redux';
import HabitGroup from '../components/HabitGroup';
import Habit from '../components/Habit';
import HabitEntry from '../components/HabitEntry';
import AddForm from './AddForm';
import {sameDay, numDaysBetween} from '../dateUtils';
import {setGroups, editGroup, addGroup, deleteGroup} from '../actions/groupActions';
import {setHabits, editHabit, addHabit, changeHabitOrder, deleteHabit} from '../actions/habitActions';
import {setEntries, deleteEntry, addEntry} from '../actions/entryActions';

class HabitApp extends React.Component {

  componentDidMount() {
    this.props.setState(this.props.data, () => { console.log(this.props) });
  }

  buildGroups(groups) {
    return groups.map((group) => {
      return ( // try bind here
        <HabitGroup key={group.id} 
                    {...group} 
                    retitle={this.props.retitle} 
                    delete={this.props.deleteGroup.bind(null, group, this.props.habits.items)}>
          {this.buildHabits(group.id, this.props.habits.items)}
        </HabitGroup>
      );
    });
  }

  buildHabits(groupId, habits) {
    return habits.map((habit) => { //move this map to groups method
      if(groupId === habit.groupId) {
        return (
          <Habit key={habit.id}
                 {...habit}
                 retitle={this.props.retitle}
                 delete={() => this.props.deleteHabit([habit.id], habit.entries)}
                 reorder={this.props.changeHabitOrder}>
            {this.buildTrack(habit.id, this.props.entries, 31)}
          </Habit>
        );
      }
    });
  }

  buildTrack(habitId, entries, range) {
    let track = [];
    let habitEntries = entries.filter(entry => habitId === entry.habitId); // move this habits
    let recentEntries = this.sortAndFilterEntries(habitEntries, range);
    // console.log(recentEntries);
    for (let i = 0; i < range; i++) {
      let d = new Date();
      d.setDate(d.getDate() - i);
      let status = 'unfilled';
      let entry;
      if(recentEntries.length > 0 && sameDay(d, recentEntries[0].date)) {
        entry = recentEntries.shift();
        status = 'filled';
      }
      let statusClass = status + ' entry-block';
      track.push(<HabitEntry key={d.toLocaleDateString('en-US')+habitId} 
                             className={statusClass} 
                             onClick={() => this.props.toggleEntry(habitId, d, entry)}/>);
    }
    return track.reverse();
  }

  sortAndFilterEntries(entries, range) {
    let d = new Date();
    return entries.filter(entry => numDaysBetween(d, entry.date) < range).sort((a,b) => a.date < b.date);
  }

  render() {
    return (
      <div className="content">
        <h1 className="app-title">Habit Tracker</h1>
        {this.buildGroups(this.props.groups.items)}
        <AddForm
          type='groups'
          title='Add a new group'
          action={this.props.addToCollection}
        />
        <AddForm
          type='habits'
          title='Add a new habit'
          targetKey='groupId'
          targetId='1'
          action={this.props.addToCollection}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups,
    habits: state.habits,
    entries: state.entries,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setState({groups, habits, entries}, callback) {
      console.log("Setting up app",groups, habits, entries);
      dispatch(setGroups({groups, habits}));
      dispatch(setHabits({habits, entries}));
      dispatch(setEntries(entries));
      callback();
    },
    retitle(type, id, title) {
      const payload = {id, title};
      if (type === 'groups') {
        dispatch(editGroup(payload));
      } else if (type === 'habits') {
        dispatch(editHabit(payload));
      }
    },
    addToCollection(type, targetKey = null, targetId = null, title) {
      const payload = {targetKey, targetId, title};
      if (type === 'groups') {
        dispatch(addGroup(payload));
      } else if (type === 'habits') {
        dispatch(addHabit(payload));
      }
    },
    changeHabitOrder(habitId, groupId, direction) {
      console.log('action prop', habitId, groupId, direction);
      dispatch(changeHabitOrder({habitId, groupId, direction}));
    },
    deleteHabit(habitIds, entryIds){
      dispatch(deleteHabit({habitIds}));
      dispatch(deleteEntry({entryIds}));
    },
    deleteGroup(group, habits){
      let entryIds = habits.reduce((acc, habit) => {
        if (group.habits.indexOf(habit.id) !== -1) {
          return acc = [...acc, ...habit.entries];
        }
        return acc;
      }, []);

      dispatch(deleteGroup({groupIds: [group.id]}));
      dispatch(deleteHabit({habitIds: group.habits}));
      dispatch(deleteEntry({entryIds}));
    },
    toggleEntry(habitId, date, entry){
      if (!entry) {
        dispatch(addEntry({habitId, date}));
      } else {
        dispatch(deleteEntry({entryIds: [entry.id]}));
      }
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitApp);
