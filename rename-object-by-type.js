/// <reference types="@mapeditor/tiled-api" />

/*
 * rename-object-by-type.js
 *
 * This extension adds a 'Rename Object by Type' (Ctrl+Shift+R) action to the Map
 * menu, which can be used to bulk rename custom objects which have a Type, very 
 * usefull if exporting the map to Godot.
 * I have based this script on https://github.com/mapeditor/tiled-extensions/blob/master/find-object-by-id.js
 * 
 */

/* global tiled */

function findObjectByType(thing, type) {
	for (let i = thing.layerCount - 1; i >= 0; i--) {
		const layer = thing.layerAt(i);

        if (layer.isGroupLayer) {
			const obj = findObjectByType(layer, type);
			if (obj) {
				return obj;
			}
		} else if (layer.isObjectLayer) {
			for (const obj of layer.objects) {
				if (obj.type == type) {
                    obj.name = obj.type + '_' + obj.id
				}
			}
		}
	}

	return null;
}


let renameObjects = tiled.registerAction("RenameObjects", function(/* action */) {
	const map = tiled.activeAsset;
	if (!map.isTileMap) {
		tiled.alert("Not a tile map!");
		return;
	}

	let type = tiled.prompt("Please enter an object type:");
	if (type == "") {
		return;
	}


	const object = findObjectByType(map, type);
	if (!object) {
		tiled.alert("Failed to find object of type " + type);
		return;
	}
});


renameObjects.text = "Rename objects of type";
renameObjects.shortcut = "Ctrl+Shift+R";

tiled.extendMenu("Map", [
	{ separator: true },
	{ action: "RenameObjects" },
]);