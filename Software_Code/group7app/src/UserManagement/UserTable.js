import React, { useState } from 'react'
import { useTable } from 'react-table'
import './table.css'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import cs
export default function UserTable(props) {
    console.log(props);
    if (!props.data) {
        props.data = []
    }
    console.log(props.data)

    let cols = !props.data.length ? [] : Object.keys(props.data[0]).map((cur) => {
        return {
            "Header": cur, "accessor": cur,
        }
    })
    const columns = React.useMemo(
        () =>
            cols, []
    )

    const positionDict = {
        0: "User",
        1: "Researcher",
        2: "Lab Manager",
        3: "Admin",
    }
    const dataCreate = props.data.map((cur) => {
        let newObj = {};
        Object.keys(cur).map((cur2) => {
            console.log();
            newObj[cur2] = (cur[cur2] == null) ? "none" : cur[cur2];
            if (cur2 == "position") {
                newObj[cur2] = positionDict[cur[cur2]]
            }
            // newObj[cur2] = (<input type="text" value={newObj[cur2]} onChange={(e) => { console.log(e.nativeEvent); console.log(e.data); console.log(e.target); }} ></input>);
            newObj[cur2] = cur[cur2]

        }); return newObj
    })
    const [data, setData] = React.useState(() => dataCreate)
    const [originalData] = React.useState(dataCreate)
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
    console.log(data);
    const EditableCell = ({
        value: initialValue,
        row: { index },
        column: { id },
        updateMyData, // This is a custom function that we supplied to our table instance
    }) => {
        // We need to keep and update the state of the cell normally
        const [value, setValue] = React.useState(initialValue)

        const onChange = e => {
            setValue(e.target.value)
            updateMyData(index, id, e.target.value)
        }

        // We'll only update the external data when the input is blurred
        const onBlur = () => {
            // updateMyData(index, id, value)
        }

        if (id == "usersID") {
            return [value]
        }
        if (id == "position") {
            return <select onChange={onChange} defaultValue={value}>
                <option value={0}>User</option>
                <option value={1}>Researcher</option>
                <option value={2}>Lab Manager</option>
                <option value={3}>Admin</option>
            </select>
        }
        if (value == null) {
            return <input value={value} onChange={onChange} onBlur={onBlur} />
        }
        if (typeof value == "object") {
            return [value]
        }
        return <input value={value} onChange={onChange} onBlur={onBlur} />
    }
    const defaultColumn = {
        Cell: EditableCell,
    }
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        defaultColumn,
        updateMyData

    })
    console.log(rows);
    console.log();
    let updateRecord = (row) => {
        console.log(row);
        let changed = []
        for (let x in row.values) {
            if (row.values[x] != originalData[row.id][x]) {
                changed.push({ key: x, old: originalData[row.id][x], new: row.values[x] })
            }
        }
        if (changed.length < 1) {
            return
        }
        console.log(changed);
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1>Are You Sure?</h1>
                        <p>You want to make these changes?</p>
                        {

                            changed.map((cur, index) => {
                                return (<div>
                                    <p>{cur.key}</p>
                                    <p>{cur.key == "position" ? positionDict[cur.old] : cur.old} changed to : {cur.key == "position" ? positionDict[cur.new] : cur.new} </p>
                                    {index != cur.length - 1 ? <hr /> : null}
                                </div>)


                            })}
                        <button className="sure-update"
                            onClick={() => {
                                // update record
                                console.log(row.values);
                                let usersID = row.values["usersID"]
                                console.log(usersID);
                                const reqOpts = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ usersID, changed })
                                };
                                fetch('http://localhost:3001/update_user', reqOpts).then(response => {
                                    response.json().then(json => {
                                        if (json == "COULD NOT UPDATE USER") {
                                            alert("Could not update user");
                                        } else {
                                            props.history.push("/refresh")
                                            props.history.push("/user_management")
                                        }
                                    });
                                });
                                onClose();
                            }}
                        >
                            Yes, Change this record!
                  </button>
                    </div>
                );
            }
        });

    }
    let deleteRecord = (row) => {
        console.log(row);
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1>Are You Sure?</h1>
                        <p>You want to delete?</p>
                        {
                            <div>
                              {Object.keys(row.values).map((cur)=>{
                                  return (
                                      <p>{row.values[cur]}</p>
                                  )
                              })}
                        </div>
                        }
                        <button className="sure-delete"
                            onClick={() => {
                                // delete
                                console.log(row.values);
                                let usersID = row.values["usersID"]
                                console.log(usersID);
                                const reqOpts = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ usersID })
                                };
                                fetch('http://localhost:3001/delete_user', reqOpts).then(response => {
                                    response.json().then(json => {
                                        if (json == "COULD NOT DELETE") {
                                            alert("Could not delete user");
                                        } else {
                                            props.history.push("/refresh")
                                            props.history.push("/user_management")
                                        }
                                    });
                                });
                                onClose();
                            }}
                        >
                            Yes, Delete this record!
                  </button>
                    </div>
                );
            }
        });

    }
    return (
        <div className="user-table-wrapper">
            <table {...getTableProps()}>
                <thead className="table-head">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                })}
                                <td className="td-update-button"> 
                                    <button className="table-update-button" onClick={() => updateRecord(row)}>update</button>
                                </td>
                                <td className="td-delete-button" >
                                     <button  className="table-delete-button" onClick={() => deleteRecord(row)}>delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}
