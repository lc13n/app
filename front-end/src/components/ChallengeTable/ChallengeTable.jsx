import React from "react";
import "./ChallengeTable.css";
import { Link } from "react-router-dom"; 

export default function ChallengeTable({ data }) {
  return (
    <table className="challenge-table">
      <thead>
        <tr>
          <th>Challenge</th>
          <th>Category</th>
          <th>Rating</th>
          <th>Users Solves</th>
        </tr>
      </thead>
      <tbody>
        {data.map((challenge, index) => (
          <tr key={index}>
            <td>
              <Link to={`/challenges/${challenge.name}`}>
                {challenge.name}
              </Link>
              <br />
              <small>{challenge.difficulty}</small>
            </td>
            <td>{challenge.category}</td>
            <td>
              {challenge.rating} ⭐ ({challenge.votes})
            </td>
            <td>
              👤 {challenge.solves}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
