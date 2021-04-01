import {remove} from 'uninst-util-remove';
import * as u from 'unist-builder';

let tree = u('root', [
  u('leaf', '1'),
  u('node', [
    u('leaf', '2'),
    u('node', [u('leaf', '3'), u('other', '4')]),
    u('node', [u('leaf', '5')])
  ]),
  u('leaf', '6')
]);

remove()          // $ExpectError
remove('leaf')    // $ExpectError

remove(tree)
remove(tree, 'leaf');
remove(tree, {cascade: false}, 'leaf');
