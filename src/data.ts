import Decimal from "break_eternity.js";

const player = {
    stone: new Decimal(0),
    wood: new Decimal(0),
    coal: new Decimal(0),
    handdrills: new Decimal(0),
};

const gameId = "incrementalfactory_savefile";

/**
 * Adds a D# to Decimal type numbers in the savefile so they can be differentiated from regular numbers when loading.
 */
function saveReplace(_key: string, value: unknown): unknown {
    if (value instanceof Decimal) return "D#" + value.toString();
    return value;
}

Decimal.prototype.toJSON = function (): string {
    return "D#" + this.toString();
};

/**
 * A utility function used when deserializing the player object, used to
 * handle Decimal values.
 */
function saveRevive(_key: string, value: unknown): unknown {
    return typeof value === "string" && value.startsWith("D#")
        ? new Decimal(value.slice(2))
        : value;
}

/**
 * Recursively merge two objects.
 * @param source The object to which copy the property values from the
 * other object.
 * @param data The object from which to copy property values.
 */
export function deepMerge<T extends object>(source: T, data: T): void {
    for (const key in data) {
        const value = data[key];
        if (
            typeof value === "object" &&
            value !== null &&
            !(value instanceof Decimal)
        ) {
            const newSource = source[key];
            if (!(key in source)) {
                // @ts-expect-error I know this is fine
                source[key] = Array.isArray(value) ? [] : {};
            }
            if (typeof newSource === "object" && newSource !== null) {
                deepMerge(newSource, value);
            }
        } else source[key] = value;
    }
}

export function save(): void {
    const savefile = btoa(JSON.stringify(player, saveReplace));
    localStorage.setItem(gameId, savefile);
}

export function load(): void {
    const save = localStorage.getItem(gameId);
    if (save === null) return;
    deepMerge(
        player,
        JSON.parse(save.startsWith("{") ? save : atob(save), saveRevive)
    );
}

export function resetGame(): void {
    localStorage.removeItem(gameId);
}

export default player;