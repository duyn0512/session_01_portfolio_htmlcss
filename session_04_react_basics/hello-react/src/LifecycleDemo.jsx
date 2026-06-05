function LifecycleDemo() {
    console.log("1️⃣ Conponent được gọi!");

    return (
        <div style={{padiing: "20px", border: "2px solid #3498db"}}>
            <h2>Lifecycle Demo</h2>
            <p>Mở console (F12) để xem log</p>
            <p>Component này chỉ render một lần</p>
        </div>
    );
}

export default LifecycleDemo;