import React, { useState } from 'react'
import { useTable } from 'react-table'
import './table.scss'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import cs
import sjcl from 'sjcl'
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
    const lockedDict = {
        0: "Unlocked",
        1: "Locked",
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
        if(id=="locked"){
            return <select onChange={onChange} defaultValue={value}>
                <option value={0}>Unlocked</option>
                <option value={1}>Locked</option>
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
                                    <p>{cur.key == "position" ? positionDict[cur.old] : cur.key == "locked" ? lockedDict[cur.old] : cur.old} changed to : {cur.key == "position" ? positionDict[cur.new] :cur.key == "locked" ? lockedDict[cur.new] :cur.new} </p>
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
                                            setTimeout(() => {
                                                props.history.push("refresh?next=user_management&message=Updating Records&timer=1000")
                                            }, 100);

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
                                {Object.keys(row.values).map((cur) => {
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
                                        console.log(json);
                                        if (json == "COULD NOT DELETE USER") {
                                            alert("Could not delete user");
                                        } else {
                                            props.history.push("refresh?next=user_management&message=Locking account / Removing Personal Data&timer=1000")
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
    let updatePassword = (row) => {
        console.log(row);
        let usersID = row.values["usersID"]
        confirmAlert({
            customUI: ({ onClose }) => {
                let myRef = React.createRef();
                return (
                    <div className='custom-ui'>
                        <h1>Enter Password</h1>
                        <input ref={myRef} type="password" onChange={(e) => { console.log(e.target.value, myRef.current.value); }}></input>
                        <button className="sure-password"
                            onClick={() => {
                                if(!myRef.current.value || myRef.current.value==""){
                                    alert("Please enter a new value for the password")
                                    return
                                }
                                const hashBitArray = sjcl.hash.sha256.hash(myRef.current.value);
                                const passHash = sjcl.codec.hex.fromBits(hashBitArray);
                                let newPassword = passHash
                                const reqOpts = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ usersID, newPassword })
                                };
                                fetch('http://localhost:3001/update_password', reqOpts).then(response => {
                                    response.json().then(json => {
                                        if (json == "COULD NOT UPDATE USER PASSWORD") {
                                            alert("Could not update user password");
                                        } else {
                                            console.log("pw",json);
                                            setTimeout(() => {
                                                props.history.push("refresh?next=user_management&message=Updating Password&timer=1000")
                                            }, 100);

                                        }
                                    });
                                });
                                onClose();
                            }}
                        >
                           Yes, Change the password!
                  </button>
                    </div>
                );
            }
        });
    }
    return (
        <div className="user-table-wrapper">
            <div {...getTableProps()}>
                <ul className="responsive-table">
                    <li className="table-header">
                        {headerGroups.map((headerGroup) => (

                            headerGroup.headers.map((column, index) => (
                                <div className={`col col-${index}`} {...column.getHeaderProps()}>{column.render("Header")}</div>
                            ))

                        ))}
                        <div className="col col-7"></div>
                        <div className="col col-8"></div>
                        <div className="col col-9"></div>
                    </li>
                    <div {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <li className="table-row" {...row.getRowProps()}>
                                    {row.cells.map((cell, index) => {
                                        return <div className={`col col-${index}`} {...cell.getCellProps()} data-label={cell.column.Header}>{cell.render("Cell")}</div>;
                                    })}
                                    <div className={`col col-${row.cells.length} td-update-button`}>
                                        <button className="table-update-button" onClick={() => updateRecord(row)}>update</button>
                                    </div>
                                    <div className={`col col-${row.cells.length + 1} td-delete-button`}>
                                        <button className="table-delete-button" onClick={() => deleteRecord(row)}>delete</button>
                                    </div>
                                    <div className={`col col-${row.cells.length + 2} td-password-button`}>
                                        <button className="table-password-button" onClick={() => updatePassword(row)}>password</button>
                                    </div>
                                </li>
                            );
                        })}
                    </div>
                </ul>
            </div>
        </div>
    )
}
