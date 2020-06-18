import { h } from "preact";
import { Canvas } from "../canvas/index"

export default (props) => {
    let { width, height, visible: image } = props;
    console.log(image)
    if (!width || !height) return null
    return (
        <Canvas
            background="transparent"
            lineWidth={10}
        >
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="rgba(0,0,0,0.5)"
            />
            <clear
                x={0}
                y={0}
                width={width}
                height={height}
            />

            <rect
                x={image.begin_X}
                y={image.begin_Y}
                width={image._width}
                height={image._height}
                stroke={[255, 0, 0]}
                lineWidth={10}
                onChange={props.onChange}
            />

            <ellipse
                cx={image.begin_X}
                cy={image.begin_Y}
                r={5}
                fill={[0, 0, 0]}
                onChange={props.onMovePoint}
            />

            <ellipse
                cx={image.begin_X + image._width}
                cy={image.begin_Y}
                r={5}
                fill={[0, 0, 0]}
                onChange={props.onMovePoint}
            />
            <ellipse
                cx={image.begin_X}
                cy={image.begin_Y + image._height}
                r={5}
                fill={[0, 0, 0]}
                onChange={props.onMovePoint}
            />
            <ellipse
                cx={image.begin_X + image._width}
                cy={image.begin_Y + image._height}
                r={5}
                fill={[0, 0, 0]}
                onChange={props.onMovePoint}
            />

        </Canvas>
    )

}