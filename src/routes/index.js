import { Switch } from 'react-router-dom';
import Home from '~/container/Home';
import NetWork from '~/container/Network';

import Route from './Route';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/network" exact isNetwork component={NetWork} />
    </Switch>
  );
}
