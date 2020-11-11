
const userName = document.querySelector('.name__input');
const nameSubmit = document.querySelector('.name__button');
const timerTime = document.querySelector('.time__input');
const timeSubmit = document.querySelector('.time__button');
const startTimer = document.querySelector('.timer__start');

class Users {
    constructor() {
        this.id = 0;
        this.users = [];
        this.elements = {
            usersList: document.querySelector(".users__list"),
            userItem: document.querySelector('#user__itemTemp')
        }
        console.log(this.elements);
    }

    _checkDuplicateItems(id) {
        const renderedItems = this.elements.usersList.querySelectorAll('.user__item');
        const idsArr = [];
        renderedItems.forEach((el) => idsArr.push(el.getAttribute('id')));
        return idsArr.some((el) => +el === id);
    }

    _deleteItem(id) {
        this.users = this.users.filter((el) => el.id !== id);
        document.getElementById(`${id}`).remove();
    }

    _renderUsers() {
        this.users.forEach((el) =>{
            if(!this._checkDuplicateItems(el.id)) {
                const userItem = this.elements.userItem.content.cloneNode(true);
                userItem.querySelector('.user__item').setAttribute('id', el.id);
                userItem.querySelector('.user__name').textContent = el.name;
                const closeButton = userItem.querySelector('.user__delete');
    
                closeButton.addEventListener('click', () => {
                    this._deleteItem(el.id);
                    console.log()
                });
    
                this.elements.usersList.appendChild(userItem);
            }
        });
    }

    add(name) {
        this.id += 1;
        this.users.push({name, id: this.id});
        this._renderUsers();
    }

    getUsers() {
        return this.users;
    }


}

class Timer {
    constructor() {
        this.mainTime = 0;
        this.time = 0;
        this.users = [];
        this.activeUserNumber = 0;
        this.interval = '';
        this.elements = {
            timerString: document.querySelector('.timer'),
            activeUser: document.querySelector('.timer__activeUser')
        }
    }

    _timer() {
        this.elements.activeUser.textContent = this.users[this.activeUserNumber].name;
        this.interval = setInterval(() => {
            this.time -= 1;
            this.elements.timerString.textContent = this.time;
            if(this.time < 1 && this.activeUserNumber < this.users.length) {
                this.time = this.mainTime;
                this.activeUserNumber += 1;
                this.elements.activeUser.textContent = this.users[this.activeUserNumber].name;
                this._timer;
            }
            if(this.activeUserNumber >= this.users.length) {
                this.activeUserNumber = 0;
                clearInterval(this.interval);
                this._timer();
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }
    setTime (time) {
        this.mainTime = time;
        this.time = time;
        console.log(time);
        timerTime.value = '';
    }

    start(users) {
        if (this.time > 0 && users.length > 0) {
            this.users = users;
            this._timer();

        } else {
            alert("Введи время и хоть одного чувака, бро!");
        }
    }
}


const users = new Users();
nameSubmit.addEventListener('click', () => {
    users.add(userName.value);
});

const timer = new Timer;
timeSubmit.addEventListener('click', () => {
    timer.setTime(+timerTime.value);
})

startTimer.addEventListener('click', () => {
    timer.start(users.getUsers());
})