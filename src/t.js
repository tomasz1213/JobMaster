let head = null;

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
};

function reverse(node) { 
    let prev = null;    //  6
    let current = node; // 6
    let next = null;    // 2
//  curent next --      // 6
    while (current != null) {
        next = current.next;
        current.next = prev;
        prev = current;
        current = next;
        console.log(next,prev,current);
        console.log('hop');
    }
    node = prev;
    return node;

}

head = new Node(6);
head.next = new Node(2);
head.next.next = new Node(7);

// console.log(head);
// console.log(reverse(head));
reverse(head);