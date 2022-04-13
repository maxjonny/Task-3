
function Rps (set) {
    this.key = new Key_gen(set);
    let script_ans = this.key.ans;
    let HMAC_key = this.key.keys;
    console.log('HMAC: ', this.key.HMAC);
    console.log('Available moves:')
    for (let i=1; i <= set.length; i++) {
        console.log(i,'-',set[i-1])
    }
    console.log(0,'-','exit')
    console.log('?','-','help')
    let readline = require('readline');
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("Enter your move: ", function(answer) {
        if ( !['?','0'].includes(answer)) {
            console.log("Your move:", set[answer-1]);
            console.log('Computer move:', script_ans);
            let game = new Game(set, script_ans, set[answer-1]);
            console.log(game.result);
            console.log('HMAC key:', HMAC_key);
        }
        else if (answer === '0')
            process.exit
        else if (answer === '?')
            new Help(set)
            rl.close();

    });
}

function Key_gen (set) {
    let forge = require('node-forge');
    let key = forge.random.getBytesSync(32);
    let iv = forge.random.getBytesSync(32);
    let cipher = forge.cipher.createCipher('AES-ECB', key);
    cipher.start({iv: iv});
    cipher.finish();
    let encrypted = cipher.output;
    this.keys = encrypted.toHex();
    this.ans = set[Math.floor(Math.random() * set.length)];
    let md = forge.md.sha256.create();
    md.update(String(this.keys)+String(this.ans));
    this.HMAC = md.digest().toHex();

}

function Help (set) {
    let mas = [];
    for (let i = 0; i < set.length+1; i++){
        mas[i] = [];
        for (let j = 0; j < set.length+1; j++) {
            let result;
            if (i === 0 && j === 0)
                result = '';
            else if (i === 0 && j > 0)
                result = set[j-1];
            else if (i > 0 && j === 0)
                result = set[i-1]
            else if (i > 0 && j > 0) {
                let gameResult = new Game(set, set[j-1], set[i-1]).result
                if (gameResult === 'You win!')
                    result = 'Win';
                else if (gameResult === 'You lose!')
                    result = 'Lose';
                else
                    result = 'Draw'
            }
            mas[i][j] = result;
        }}
    for (let i = 0; i < mas.length;i++){
        console.log(mas[i])
    }

}

function Game (list, script_ans, user_ans) {
    let n = list.indexOf(script_ans)+Math.floor(list.length / 2)
    let win, result = '';
    if (script_ans === user_ans){
        result = 'Draw'
    }
    else if (n <= list.length-1) {
        win = list.slice(list.indexOf(script_ans) + 1, n + 1);
    }
    else if (n>=list.length-1) {
         win = list.slice(list.indexOf(script_ans)+1, list.length)
         win = win.concat(list.slice(0, n-list.length+1))
        }
    if (result === '' && win.includes(user_ans)) {
        result = 'You win!'
    }
    else if (result === '' && ! win.includes(user_ans)) {
        result = 'You lose!'
    }
    this.result = result

}

let set = process.argv.slice(2,)
let set_uniq = new Set(set)
set_uniq = [...set_uniq]
if (set.length % 2 !== 1 || set.length === 1 || set.length === 0) {
    console.log('Неверное количество параметров');
    process.exit
}
else if (set.length !== set_uniq.length){
    console.log('В параметрах имеются дубликаты');
    process.exit
}
else new Rps(set);

