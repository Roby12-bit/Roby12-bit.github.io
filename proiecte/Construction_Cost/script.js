document.addEventListener("DOMContentLoaded", function() {
    
    const form = document.getElementById("estimatorForm");
    const resultsBox = document.getElementById("results");

    form.addEventListener("submit", function(event) {
        
        event.preventDefault();

        // 1. Retrieve values from the form inputs
        const baseRate = parseFloat(document.getElementById("projectType").value);
        const area = parseFloat(document.getElementById("area").value);
        const qualityMultiplier = parseFloat(document.getElementById("materialQuality").value);

        // 2. Core Calculations
        // Formula: (Area * Base Rate) * Quality Multiplier
        const totalEstimatedCost = (area * baseRate) * qualityMultiplier;
        
        // Calculate splits with 60% materials, 40% labor)
        const materialsCost = totalEstimatedCost * 0.60;
        const laborCost = totalEstimatedCost * 0.40;

        // 3. Output formatting and UI Update
        const formatter = new Intl.NumberFormat('en-IE', { 
            style: 'currency', 
            currency: 'EUR' 
        });

        document.getElementById("totalCost").innerText = formatter.format(totalEstimatedCost);
        document.getElementById("materialCost").innerText = formatter.format(materialsCost);
        document.getElementById("laborCost").innerText = formatter.format(laborCost);

        resultsBox.classList.remove("hidden");
    });
});