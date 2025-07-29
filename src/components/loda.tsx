// This is inside your wsRef.current.onmessage function...
if (executedNodeId === finalNodeId) {
    const finalImageNodeOutput = output[finalNodeId];

    if (finalImageNodeOutput && finalImageNodeOutput.images && finalImageNodeOutput.images.length > 0) {
        // SUCCESS: This part is likely correct.
        updateStatus('Execution complete! Fetching image...');
        const finalImage = finalImageNodeOutput.images[0];
        const imageUrl = ${ngrokUrl}/view?filename=${encodeURIComponent(finalImage.filename)}&subfolder=${encodeURIComponent(finalImage.subfolder)}&type=${finalImage.type};

        setResultImage(imageUrl);
        updateStatus('Done!');
        setProgress(100);
    } else {
        // --- THIS IS THE MODIFIED PART FOR DEBUGGING ---
        // ERROR: This block is being triggered. Let's find out why.
        const errorMessage = Error: Final node ${finalNodeId} executed but did not produce the expected image output.;
        updateStatus(errorMessage, true);

        // Add this detailed logging to see what the server actually sent.
        console.error("DEBUG: The full 'output' object from the server for the final execution event was:");
        console.error(JSON.stringify(output, null, 2));
    }
    
    wsRef.current?.close();
}