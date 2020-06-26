import { h, Component, cloneElement } from "preact"
import { Canvas } from "../canvas/index"
import { connect } from "../mc/model-view"
import { setHueLight } from "../mc/updater"

export let ColorPicker = connect(
    ["pen", "activeColor"],
    ({path, merge}, {activeColor}) => ({

        setFill:({}, {ctrl, getColor}) => path.set({
            fill : getColor()
        })
            
        ,
        setRadius: ({r}) => merge({
            pen :{radius : r}
        }),
        drawCircle: ({}, {clientX, clientY, getColor}) => merge({
            pen : {
                x: clientX, 
                y: clientY,
                center : getColor()
            }
        }),

        //setColor : ({}, {getColor}) => ,
        /*
        setStopColor: ({width, height}, { clientX, clientY }) =>
            updater.setStopColor(clientY/height, clientX/width)
        ,
        replaceColor : ({width, height}, {clientX, clientY}) =>
            updater.replaceColor(clientY/height, clientX/width)
        */
    })
)(
    ({pen, activeColor, ...on}) => {
        let radial = {
            type : "radial",
            config : [pen.x, pen.y, 1, pen.x, pen.y, 40],
            colors : [pen.center, activeColor]
        }
        return (
            <Canvas
                redraw = {false}
                width={360}
                heigh={360} 
                fill="grey"
                onChange = {on.drawCircle}
                onSubClick={on.setFill}
                onClick = {on.drawCircle}
            >
                <ellipse
                    //opacity = {0.1} 
                    r={10}
                    lineWidth = {20} 
                    cx ={pen.x} 
                    cy = {pen.y}
                    stroke = {radial}
                />
                <group y={0} x={0} height={50} width={360}

                //translate={[0, 10]}
                >
                    <rect
                        fill={{
                            type: "linear",
                            config: [0, 0, 360, 0],
                            colors: "red-yellow-green-cyan-blue-magenta-red".split("-")
                        }}
                    />

                    <rect
                        fill={{
                            type: "linear",
                            config: [0, 0, 0, 50],
                            colors: "black-transparent-white".split("-")
                        }}
                        
                    />

                </group>

                

            </Canvas>
        )

    })
/*

           

*/
