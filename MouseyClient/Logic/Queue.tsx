export class Queue<T> {
  map: T[];
  
  constructor() {
    this.map = [];
  }

  //The function return the value of index at the queue
  getIndex = (index):T => this.map[index];

  //The function return the top of the queue
  peek = ():T => this.map[0];

  //The function push a value to the queue
  enqueue = (value:T):void => {
      this.map.push(value);
  }
  
  //The function pop the first value of the queue
  dequeue = ():T => this.map.shift();
  
  //The function return the size of the queue 
  size = ():number => this.map.length;
  
  //The function return if the queue is Empty
  isEmpty = ():boolean => this.map.length==0;
}
