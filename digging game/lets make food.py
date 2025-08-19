import json

from pynput.keyboard import Key, KeyCode, Listener
import os
import random
import sys

class vec: # my beloved laziness to import smth else
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __add__(self, other):
        return vec(self.x + other.x, self.y + other.y)
    def __sub__(self, other):
        return vec(self.x - other.x, self.y - other.y)
    def __mul__(self, other): # dot product
        return vec(self.x * other.x, self.y * other.y)
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    def __ne__(self, other):
        return self.x != other.x or self.y != other.y
    def __iadd__(self, other):
        return vec(self.x + other.x, self.y + other.y)
    def __isub__(self, other):
        return vec(self.x - other.x, self.y - other.y)
    def __imul__(self, other):
        return vec(self.x * other.x, self.y * other.y)
    def __repr__(self):
        return f'({self.x}, {self.y})'
    def __hash__(self):
        return hash((self.x, self.y))

dirs = {
    'w': vec(0, -1),
    'a': vec(-1, 0),
    's': vec(0, 1),
    'd': vec(1, 0)
}

class Tile:
    def __init__(self, x, y, mined = False, rand = None):
        self.x = x
        self.y = y
        self.mined = mined
        if rand is None:
            rand = random.randint(0, 99)
        self.rand = rand
        if rand < 75:
            self.tile = 'stone'
            self.code = '\x1b[48;5;242;38;5;240m'
        elif rand < 87:
            self.tile = 'coal'
            self.code = '\x1b[48;5;233;38;5;235m'
        elif rand < 96:
            self.tile = 'gold'
            self.code = '\x1b[48;5;226;38;5;220m'
        else:
            self.tile = 'diamond'
            self.code = '\x1b[48;5;87;38;5;80m'
    def printMe(self):
        return self.code + (' ' * self.mined + '#' * (not self.mined))

playerData = {'pos': vec(0, 0)}
gameData = {}

savePath = 'C:\\Users\\' + os.getlogin() + '\\AppData\\Local\\Digging Game\\save data.json'
while True:
    sys.stdout.write('\x1b[2J\x1b[HWould you like to load your previous save data? (type y / n)\n> ')
    loadYesNo = sys.stdin.readline().strip().lower()
    if loadYesNo == 'y':
        with open(savePath, 'r') as file:
            fileData = json.load(file)
            player_pos = fileData['player']['pos']
            playerData = {'pos': vec(player_pos['x'], player_pos['y'])}
            gameDataJson = fileData['game']
            gameData = {}
            for tileData in gameDataJson:
                vecPos = vec(tileData['x'], tileData['y'])
                tile = Tile(tileData['x'], tileData['y'], tileData['mined'], tileData['rand'])
                gameData[vecPos] = tile
        break
    elif loadYesNo == 'n':
        break
    else:
        sys.stdout.write('Invalid answer. Try again.\n')
        sys.stdout.flush()
        continue

pos = playerData['pos']
print(pos)
print(playerData)
def update(dir):
    global gameData, pos
    pos = pos + dir
    message = '#======#==========================#\n∥ Game ∥ WASD to move ESC to quit ∥\n#======#==========================#\n∥'
    for j in range(pos.y - 5, pos.y + 6):
        for i in range(pos.x - 5, pos.x + 6):
            if not vec(i, j) in gameData:
                gameData[vec(i, j)] = Tile(i, j)
            if vec(i, j) != pos:
                message += gameData[vec(i, j)].printMe() * 3
            else:
                message += '\x1b[48;5;40;38;5;118m @ '
                gameData[vec(i, j)].mined = True
        message += '\x1b[0m∥\n'
        if j != pos.y + 5:
            message += '∥'
        else:
            message += '#=================================#\n> '


    sys.stdout.write('\r\x1b[H' + message)
    sys.stdout.flush()
active = True
update(vec(0, 0))


def closeGame():
    global active, pos
    active = False
    listener.stop()
    while True:
        sys.stdout.write('\x1b[2J\x1b[HWould you like to save your game before closing? (type y / n)\n> ')
        sys.stdout.flush()
        answer = sys.stdin.readline().strip().lower()
        if answer == 'y':
            # Convert vec objects to serializable format
            serializable_player = {
                'pos': {'x': pos.x, 'y': pos.y}
            }

            jsonShit = {'player': serializable_player, 'game': []}
            for tilePos, tile in gameData.items():
                entryShit = {'x': tile.x, 'y': tile.y, 'mined': tile.mined, 'rand': tile.rand}
                jsonShit['game'].append(entryShit)

            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(savePath), exist_ok=True)

            with open(savePath, 'w') as file:
                json.dump(jsonShit, file)
            sys.exit()
        elif answer == 'n':
            sys.exit()
        else:
            sys.stdout.write('Invalid answer. Try again.\n')
            sys.stdout.flush()

def captDir(key):
    if key == Key.esc:
        listener.stop()

        closeGame()
        return
    else:
        for d, v in dirs.items():
            if key == KeyCode.from_char(d) and active:
                update(v)


listener = Listener(on_press=captDir)
listener.start()
listener.join()