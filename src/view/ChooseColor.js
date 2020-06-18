import { h, Component, cloneElement } from "preact"
import { Canvas } from "../canvas/index"
import { connect } from "../mc/model-view"
import { setHueLight } from "../mc/updater"

export let ColorPicker = connect(
    [],
    (updater) => ({
        setStopColor: ({width, height}, { clientX, clientY }) =>
            updater.setStopColor(clientY/height, clientX/width)
        ,
        replaceColor : ({width, height}, {clientX, clientY}) =>
            updater.replaceColor(clientY/height, clientX/width)
    })
)(
    (on) => {

        return (
            <Canvas
                width={255} height={60} fill="grey"
            >
                <group y={0} x={0} height={60} width={255}

                //translate={[0, 10]}
                >
                    <rect
                        fill={{
                            type: "linear",
                            config: [0, 0, 0, 60],
                            colors: "red-yellow-green-cyan-blue-magenta-red".split("-")
                        }}
                    />

                    <rect
                        fill={{
                            type: "linear",
                            config: [0, 0, 255, 0],
                            colors: "black-transparent-white".split("-")
                        }}
                        onClick={on.setStopColor}
                        onSubClick={on.replaceColor}
                    />

                </group>

            </Canvas>
        )

    })

