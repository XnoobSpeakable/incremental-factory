//import Decimal from 'break_eternity.js';
import player, { save, load } from './data';
import element from './dom';
import './style.css';

load();

// MINING

function mine(resource: string): void {
    switch (resource) {
        case "wood":
            player.wood = player.wood.add(10);
            break;
        case "stone":
            player.stone = player.stone.add(player.handdrills.times(4).add(5));
            break;
        case "coal":
            player.coal = player.coal.add(player.handdrills.times(1).add(1));
            break;
    }
}

element("minewood").onclick = () => {
    mine("wood");
};

element("minestone").onclick = () => {
    mine("stone");
};

element("minecoal").onclick = () => {
    mine("coal");
};

// CRAFTING

const crafts = {
    handdrill: {
        wood: 250,
        stone: 50
    }
}

function craft(resource: string): void {
    switch (resource) {
        case "handdrill":
            if(player.wood.gte(crafts.handdrill.wood) && player.stone.gte(crafts.handdrill.stone)) {
                player.wood = player.wood.sub(crafts.handdrill.wood);
                player.stone = player.stone.sub(crafts.handdrill.stone);
                player.handdrills = player.handdrills.add(1);
            }
            break;
    }
}

element("crafthanddrill").onclick = () => {
    craft("handdrill");
}

// CRAFTING RECIPE DISPLAY

element("crafthanddrill").onmouseover = () => {
    element("recipe").textContent = `Crafting recipe: ${crafts.handdrill.wood} Wood, ${crafts.handdrill.stone} Stone`;
}

element("crafthanddrill").onmouseout = () => {
    element("recipe").textContent = "Crafting recipe: none";
}


function textUpdate(): void {
    element("wooddisplay").textContent = `Wood: ${player.wood.toString()}`;
    element("coaldisplay").textContent = `Coal: ${player.coal.toString()}`;
    element("stonedisplay").textContent = `Stone: ${player.stone.toString()}`;
    element("handdrilldisplay").textContent = `Hand Drills: ${player.handdrills.toString()}`;
}

const TPS = 20;
// game loop
setInterval(() => {
    textUpdate();
}, 1000 / TPS);

// save loop
setInterval(() => {
    save();
}, 3000);