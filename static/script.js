document.addEventListener("DOMContentLoaded", () => { 
    const fileInput = document.getElementById("file");
    const analyzeBtn = document.getElementById("analyze-btn");
    const refreshBtn = document.getElementById("refresh-btn");
    const resultSection = document.getElementById("result");
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Export PDF";
    exportBtn.classList.add("primary-btn");
    exportBtn.style.display = "none";
    document.body.appendChild(exportBtn);

    fileInput.addEventListener("change", () => {
        analyzeBtn.disabled = !fileInput.files.length;
    });

    analyzeBtn.addEventListener("click", async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                resultSection.innerHTML = `<p class='error'>${data.error}</p>`;
                exportBtn.style.display = "none";
            } else {
                resultSection.innerHTML = `
                    <h2>Analysis Result</h2>
                    <p>${data.result.replace(/\n/g, '<br>')}</p>
                    <img src="${data.image}" alt="Processed Leaf Image">
                `;
                exportBtn.style.display = "block";
            }
        } catch (error) {
            console.error("Error:", error);
            resultSection.innerHTML = `<p class='error'>Failed to analyze the image. ${error.message}</p>`;
            exportBtn.style.display = "none";
        }
    });

    refreshBtn.addEventListener("click", () => {
        fileInput.value = "";
        analyzeBtn.disabled = true;
        resultSection.innerHTML = "";
        exportBtn.style.display = "none";
    });

    exportBtn.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("LeafScan Analysis Report", 10, 10);
        doc.text(resultSection.innerText, 10, 20);
        doc.save("LeafScan_Report.pdf");
    });
});
