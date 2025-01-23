import React, {useState} from "react";
import "./Add.css";

const Add: React.FC = () => {
    const [subject, setSubject] = useState("Mathematics");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState("");
    const [learningMode, setLearningMode] = useState("");
    const [frequency, setFrequency] = useState("");
    const [startDate, setStartDate] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token = sessionStorage.getItem("accessToken");
        const username = localStorage.getItem("username");

        const adData = {
            subject,
            description,
            level: level,
            learning_mode: learningMode || undefined,
            frequency: frequency || undefined,
            start_date: startDate || undefined,
            username: username,
        };

        try {
            const response = await fetch("http://localhost:8000/api/add/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(adData),
            });

            if (response.ok) {
                const data = await response.json();
                alert("The advertisement has been added successfully!");
                console.log(data);
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                alert("An error occurred while adding the advertisement.");
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Failed to connect to the server.");
        }
    };

    return (
        <div className="add-container">
            <form className="add-form" onSubmit={handleSubmit}>
                <h1 className="add-title">Add Advertisement</h1>

                <div className="form-row">
                    <div className="form-group">
                        <label>Subject / Topic *</label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        >
                            <option>Mathematics</option>
                            <option>Physics</option>
                            <option>Computer Science</option>
                            <option>English</option>
                            <option>History</option>
                            <option>Biology</option>
                            <option>Chemistry</option>
                            <option>Geography</option>
                            <option>Civic Education</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Level of Study *</label>
                        <select value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                required
                        >
                            <option value="">Select level</option>
                            <option>High School</option>
                            <option>University</option>
                            <option>Primary School</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Advertisement Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write something"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Learning Mode </label>
                        <select
                            value={learningMode}
                            onChange={(e) => setLearningMode(e.target.value)}
                        >
                            <option value="">Select mode</option>
                            <option>In-person meetings</option>
                            <option>Online</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Meeting Frequency </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                        >
                            <option value="">Select frequency</option>
                            <option>Once a week</option>
                            <option>Twice a week</option>
                            <option>Daily</option>
                            <option>Once a month</option>
                            <option>Every two weeks</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Start Date </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <label>* - required </label>
                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        Publish
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Add;
