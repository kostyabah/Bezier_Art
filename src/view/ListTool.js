import { connect } from "../mc/model-view"

import { h } from "preact"
import { Canvas } from "../canvas"
import Map from "./Each"



let icon = {
    add: {
        x: [6, 6, 9, 9, 15, 15, 9, 9, 6, 6, 0, 0, 6],
        y: [6, 0, 0, 6, 6, 9, 9, 15, 15, 9, 9, 6, 6]
    },
    copy: {
        x: [5, 0, 0, 10, 10, 5, 5, 15, 15, 5, 5],
        y: [5, 5, 0, 0, 10, 10, 5, 5, 15, 15, 5]
    },
    remove: {
        x: [0, 15, 0, 15, 0, 0, 15, 15],
        y: [0, 15, 15, 0, 0, 15, 0, 15]
    },
    arrow: {
        y: [0, 10, 10, 15, 15, 10, 10, 0, 0],
        x: [5, 5, 0, 6, 9, 15, 10, 10, 5]
    },

    group: {
        x : [0, 8, 15, 15, 0, 0],
        y : [0, 0, 8, 15, 15, 0]
    }
}

export default connect(
    ["layers", "icons", "activeShape", "offset" ],
    ({ path, grad }, { activeShape }) => {
        let //remove = ({ index }) => path.delete(index),
            addPath = ({ index }) => path.add({}, index),
            copy = ({ index }) => path.add(activeShape, index),
            toogle = ({ index }) => path.toogle(index),
            replace = ({ index, name }) => path.turn([index], name),
            createGroup = () => path.add({}, null, true);
        //enableGroup = ({ index }) => path.enableGroup(index),
        //disableGroup = ({ index }) => path.disableGroup(index)
        return {
            //remove, 
            addPath, copy, toogle, replace, createGroup,//enableGroup, disableGroup,
            changeTumb: ({ index }, { clientX }) => grad.setValue(clientX / 150, index)
        }
    }
)(({ layers, icons, offset: startIndex, ...on }) => {
    let menu = (
        <group width={15} height={15} y={0} fill="lightgrey">
            <rect x={125}
                onClick={on.addPath}
            >
                <polyline {...icon.add}
                    translate={[125, 0]}
                    fill="grey"
                    onClick={on.addPath}
                />
            </rect>
            <rect x={25}
                onClick={on.copy}
            >
                <polyline {...icon.copy}
                    translate={[25, 0]}
                    stroke="back" lineWidth={3}
                />
            </rect>
            

            <rect x={100}
                onClick={on.createGroup}
            >
                <polyline {...icon.group}
                    translate={[100, 0]}
                    fill="grey"
                />
            </rect>            

        </group>
    )

    let Box = ({posX, list, name}) => {
        console.log(list)
        return list.map(({ x, ax, ay, y, ...item }, index) => (
            <group
                index={startIndex + index}
                stroke={[0, 0, 0]}
                fill = "white"
                //translate={[0, 20 + index * 50]}
            >
                <rect y={20 + index * 50} x={posX} height={50} width={50}
                    onSubClick={on.toogle}
                    index = {item.keyPath}
                    name = {name}
                    onClick = {on.replace}

                    key={`replace-${name}-${startIndex + index}`}
                >
                    <path 
                        translate={[posX, 20 + index * 50]} 
                        {...{ x, y, ax, ay }}
                        fill={item.fill}
                    />
                </rect>
            </group>
        )) 

        
    }

    return (
        <Canvas
            height={600}
            fill = "silver"
        >
            {menu}
            <Box posX = {20} list = {icons}  name ="groups"/>
            <Box posX = {80} list = {layers} name = "keysPaths" />
            
        </Canvas>
    )
})