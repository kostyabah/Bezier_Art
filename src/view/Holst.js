
import { h, Component } from "preact"
import { Canvas } from "../canvas/index"
import { connect } from "../mc/model-view"
import Each from "./Each"
import "./style.less"
import dataList from "../mc/dataList"
//import { ProgressPlugin } from "webpack"




let Path = ({ x, y, ax, ay, fill, ...props }) => {
    console.log(fill)
    return (
        <path
            key={`path-${props.index}`}
            x={x} y={y} ax={ax} ay={ay}
            fill={fill}
            index={props.index}
            close
            lineWidth={1}
            onStart={props.onStart}
            onChange={props.onChange}
            onSubClick={props.onSelect}
        />
    )
}



export default connect(
    ["shapes", "activeShape"],
    (
        { path }, 
        { 
            activeShape: { 
                x, y, ax, ay,
                editAll, 
                mainIndex,  
                keyPath,
                groupId 
            }, selectPath 
        }
    ) => ({

        addPath: () => path.add(),
        pathSelect: ({ index }) => path.select(index),
        deleteCircle: ({ index }) => path.change( 
            trans => trans.del(index)
        ),
        initChange: ({ }, move) => path.change( trans => 
            trans.insert({
                x: move.clientX, 
                y: move.clientY,
                ax: move.clientX, 
                ay: move.clientY,
            }, mainIndex)
        ),

        editDirect: ({ }, { clientX, clientY }) => path.change( 
            trans =>trans.editHand(mainIndex, {
                ax: clientX,
                ay: clientY 
            })
        ), 
            

        changeStart: ({ index }) => index === mainIndex
            ? path.set({
                editAll: !editAll 
            }) 
            : path.set({
                mainIndex : index
            })
        ,

        circleChange: ({ index, cx, cy }, { clientX, clientY, ctrl }) => {
        
            let center = { x: x[mainIndex], y: y[mainIndex] },
                old = { x: cx, y: cy },
                move = { x: clientX, y: clientY },
                vector = {
                    x: clientX - cx,
                    y: clientY - cy,
                    ax: clientX - cx,
                    ay: clientY - cy
                },
                pointChange = trans => mainIndex === index
                    ? trans.translate(vector)
                    : trans.rotate(move, old, center),
                filterGroup;
            if(editAll){
                filterGroup = path => path.groupId === groupId;
            }        

            if(!ctrl && !editAll){
                pointChange = trans => trans.translate(
                    vector,
                    [index]
                )
            }

            return path.change(pointChange, filterGroup)
            //console.log(decide)
            //debugger
        },

        directChange: ({ index, isfront }, { clientX, clientY }) => {
            let point = {x: clientX, y: clientY}
            return path.change(trans => trans.changeDirection(point, isfront, index))
        }
    })


)(
    (props) => {

        let filter = (item, index, array) =>
            index == 0 || index == (array.length - 1)
        let { shapes, activeShape: {x, y, ax, ay, editAll, mainIndex} } = props
        console.log(props)
        return (
            <Canvas lineWidth={1}
                //onClick={props.click}
                onStart={props.initChange}
                onChange={props.editDirect}
                //onLoad={props.addPath}
                onSubClick={props.addPath}
            >
                {/* <image src={props.image.url} />*/}
                {shapes.map((item, index) => (
                    <Path {...item}
                        index={index}
                        onStart={props.initChange}
                        onChange={props.editDirect}
                        onSelect={props.pathSelect}
                    />
                ))}

                <Each
                    bx={i => 2 * x[i] - ax[i]}
                    by={i => 2 * y[i] - ay[i]}
                    x={x}
                    y={y}
                    ax={ax}
                    ay={ay}
                    fill={i => i !== mainIndex
                        ? "orange"
                        : editAll
                            ? "green"
                            : "red"
                    }
                    index={i => i}
                    show={i => i === mainIndex || (i + 1) % x.length === mainIndex}
                >
                    {({ x, y, ax, ay, fill, show, by, bx, index }) => (
                        <group>
                            <group
                                show={show}
                            >
                                <polyline
                                    x={[ax, 2 * x - ax]}
                                    y={[ay, 2 * y - ay]}
                                    fill="grey"
                                    lineWidth={3}
                                    stroke="lightgrey"
                                />
                                <ellipse
                                    key={`front-${index}`}
                                    r={3}
                                    index={index}
                                    cx={ax}
                                    cy={ay}
                                    isfront={true}
                                    onChange={props.directChange}
                                    fill="blue"
                                />
                                <ellipse
                                    key={`back-${index}`}
                                    index={index}
                                    cx={bx}
                                    cy={by}
                                    r={3}
                                    onChange={props.directChange}
                                    isfront={false}
                                    fill="blue"
                                />
                            </group>
                            <ellipse
                                key={`center-${index}`}
                                cx={x}
                                cy={y}
                                r={3}
                                index={index}
                                fill={fill}
                                onSubClick={props.deleteCircle}
                                onChange={props.circleChange}
                                onClick={props.changeStart}
                            />
                        </group>
                    )}
                </Each>
            </Canvas>
        )
    }
)
