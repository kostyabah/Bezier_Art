import { h } from "preact"
import { connect } from "../mc/model-view"
import { Canvas } from "../canvas/index"
import {mix} from "../mc/comput"
import Each from "./Each"
import { addColor } from "../mc/updater"

export default connect(
    ["tringle", "activeColor", "gradient", "counterColor"],

    ({ addColor, delColor, replaceColor, path }, { gradient }) => ({
        addColor: ({ clientX }) => addColor(clientX / 10),
        delTringle: ({index}) => delColor(index),
        selectStopColor :({index})=> ({
            counterColor : index
        }),
        changeColor:(_, {clientX}) => path.set({
            tringle: clientX * (gradient.length - 1) / 600
        })
        //changeTringle: ({clientX, index})=> replace
    })

)(({ gradient, positions, activeColor, tringle, counterColor, ...on }) => {
    //console.log(props)
    let getLeft = (i, length) => 
        i === 0 
            ? 0
            : 300/(length-1) + (i-1) * 600 / (length-1);
    let getSize = (i, length) => 
        i===0 || i === length-1
            ? 300/(length-1)
            : 600/(length-1)

    return /*props.gradient && */ (
        <Canvas
            width={600}
            height={30}
            onClick={on.changeColor}
        >
            <group y={0} height = {10}  stroke = "grey">
            {gradient.map((color, i, {length}) => (
                <rect  
                    x ={getLeft(i, length)} 
                    width = {getSize(i, length)}  
                    fill={color} 
                    index = {i}
                    lineWidth = {4}
                    stroke = {i === counterColor && "grey"}
                    //onChange={changeTringle}
                    onSubClick={on.delTringle}
                    onClick={on.selectStopColor}
                />
            ))
            }    
            </group>


            <ellipse 
                cy ={15} cx = {tringle} r={4}
                lineWidth = {2} 
                stroke = "black"
                fill = {activeColor}
            />

            <rect y={20} x={0} height={10} width={600}
                stroke="green"
                
                //onClick = {on.addColor}
                fill={{
                    type: "linear",
                    config: [0, 0, 600, 0],
                    colors: gradient,
                    //positions : gradient.positions
                }}
            />
            
            

            


        </Canvas>
    )
})


