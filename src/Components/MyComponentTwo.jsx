import { useEffect, useState } from "react";

export default function MyComponentTwo({radius}) {
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(75, 75, radius, 0, 2 * Math.PI);
        ctx.fill();
    }, [canvas, radius]);

    return (
        <div className="my-component-two">
            <canvas ref={setCanvas} width={150} height={150} />
        </div>
    );
}