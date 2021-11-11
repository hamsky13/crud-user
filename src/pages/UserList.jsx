import React, { useState, useEffect } from "react";
import { API_URL } from "../constants/API";
import axios from "axios";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import { Accordion } from "react-bootstrap";

function UserList() {
  const [userList, setUserList] = useState([]);
  const [maxPage, setMaxpage] = useState(0);
  const [page, setPage] = useState(1);
  const [addUserList, setAddUserList] = useState({
    addNama: "",
    addNip: "",
    addPhone: "",
    addEmail: "",
  });
  const [editId, setEditId] = useState(0);
  const [editUserList, setEditUserList] = useState({
    editNama: "",
    editNip: "",
    editPhone: "",
    editEmail: "",
  });
  const [filterList, setFilterList] = useState({
    filterNama: "",
    filterNip: "",
    filterEmail: "",
  });
  const [dataFilter, setDataFilter] = useState([]);
  const itemPerPage = 5;
  const d = new Date();
  const tahun = d.getFullYear() - 2000;

  const fetchUserList = () => {
    axios
      .get(`${API_URL + "/user"}`)
      .then((result) => {
        setUserList(result.data);
        setDataFilter(result.data);
        setMaxpage(Math.ceil(result.data.length / itemPerPage));
        let urutanNip = "";
        if (result.data[result.data.length - 1].id + 1 < 10) {
          urutanNip =
            "000" + (result.data[result.data.length - 1].id + 1).toString();
        } else if (result.data[result.data.length - 1].id + 1 < 100) {
          urutanNip =
            "00" + (result.data[result.data.length - 1].id + 1).toString();
        } else if (result.data[result.data.length - 1].id + 1 < 1000) {
          urutanNip =
            "0" + (result.data[result.data.length - 1].id + 1).toString();
        } else {
          urutanNip = (result.data[result.data.length - 1].id + 1).toString();
        }
        const tambahNip = tahun.toString() + urutanNip;
        setAddUserList({ addNip: tambahNip });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const inputHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setAddUserList({ ...addUserList, [name]: value });
  };

  const editHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setEditUserList({ ...editUserList, [name]: value });
  };

  const filterHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFilterList({ ...filterList, [name]: value });
  };

  const addUser = () => {
    axios
      .post(`${API_URL}/user`, {
        nama: addUserList.addNama,
        nip: addUserList.addNip,
        phone: addUserList.addPhone,
        email: addUserList.addEmail,
      })
      .then(() => {
        setAddUserList({
          addNama: "",
          addNip: "",
          addPhone: "",
          addEmail: "",
        });
        fetchUserList();

        alert("User Berhasil ditambahkan");
      });
  };

  const nextPageHandler = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };

  const prevPageHandler = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const editToggle = (editData) => {
    setEditId(editData.id);
    setEditUserList({
      ...editUserList,
      editNama: editData.nama,
      editNip: editData.nip,
      editPhone: editData.phone,
      editEmail: editData.email,
    });
  };

  const cancelEdit = () => {
    setEditId(0);
  };

  const saveBtnHandler = () => {
    axios
      .patch(`${API_URL}/user/${editId}`, {
        nama: editUserList.editNama,
        nip: editUserList.editNip,
        phone: editUserList.editPhone,
        email: editUserList.editEmail,
      })
      .then(() => {
        alert("Berhasil memperbarui Data!");
        fetchUserList();
        cancelEdit();
      })
      .catch((err) => {
        alert("Gagal Memperbarui Data!");
      });
  };

  const deleteBtnHandler = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure want to delete this User?"
    );
    if (confirmDelete) {
      axios
        .delete(`${API_URL}/user/${id}`)
        .then(() => {
          fetchUserList();
        })
        .catch((err) => {
          alert("Terjadi Kesalahan di Server!");
        });
    } else {
      alert("Cancel delete user");
    }
  };

  const filterRender = () => {
    const filteredUserList = userList.filter((val) => {
      return (
        val.nama.toLowerCase().includes(filterList.filterNama.toLowerCase()) &&
        val.nip.includes(filterList.filterNip) &&
        val.email.toLowerCase().includes(filterList.filterEmail.toLowerCase())
      );
    });
    setDataFilter(filteredUserList);
    setMaxpage(Math.ceil(filteredUserList.length / itemPerPage));
    setPage(1);
  };

  const renderUser = () => {
    const indexAwal = (page - 1) * itemPerPage;
    let rawData = [...dataFilter];
    const currentData = rawData.slice(indexAwal, indexAwal + itemPerPage);

    return currentData.map((val) => {
      if (val.id === editId) {
        return (
          <tr key={val.id}>
            <td>{val.id}</td>
            <td>
              <input
                value={editUserList.editNama}
                onChange={editHandler}
                type="text"
                className="form-control"
                name="editNama"
              />
            </td>
            <td>
              <input
                value={editUserList.editNip}
                onChange={editHandler}
                type="number"
                className="form-control"
                name="editNip"
              />
            </td>
            <td>
              <input
                value={editUserList.editPhone}
                onChange={editHandler}
                type="text"
                className="form-control"
                name="editPhone"
              />
            </td>
            <td>
              <input
                value={editUserList.editEmail}
                onChange={editHandler}
                type="text"
                className="form-control"
                name="editEmail"
              />
            </td>

            <td>
              <button onClick={saveBtnHandler} className="btn btn-success">
                Save
              </button>
            </td>
            <td>
              <button onClick={cancelEdit} className="btn btn-danger">
                Cancel
              </button>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={val.id}>
            <td>{val.id}</td>
            <td>{val.nama}</td>
            <td>{val.nip}</td>
            <td>{val.phone}</td>
            <td>{val.email}</td>
            <td>
              <button
                onClick={() => {
                  editToggle(val);
                }}
                type="button"
                className="btn btn-warning"
              >
                Edit
              </button>
            </td>
            <td>
              <button
                onClick={() => deleteBtnHandler(val.id)}
                type="button"
                className="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        );
      }
    });
  };

  useEffect(() => {
    fetchUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <div className="add-user">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Add User</Accordion.Header>
            <Accordion.Body>
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Nama
                </span>
                <input
                  type="text"
                  onChange={inputHandler}
                  value={addUserList.addNama}
                  name="addNama"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  No. Tlp
                </span>
                <input
                  type="text"
                  onChange={inputHandler}
                  value={addUserList.addPhone}
                  name="addPhone"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Email
                </span>
                <input
                  type="text"
                  onChange={inputHandler}
                  value={addUserList.addEmail}
                  name="addEmail"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
              <div className="d-grid gap-2">
                <button
                  onClick={() => addUser()}
                  className="btn btn-primary"
                  type="button"
                >
                  Save
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="pagination d-flex flex-row justify-content-around align-items-center mt-3">
        <button
          disabled={page === 1}
          onClick={prevPageHandler}
          className="btn btn-dark"
        >
          {"<"}
        </button>
        <div className="text-center">
          Page {page} of {maxPage}
        </div>
        <button
          disabled={page === maxPage}
          onClick={nextPageHandler}
          className="btn btn-dark"
        >
          {">"}
        </button>
      </div>
      <div className="filter-data d-flex mt-3">
        <input
          type="text"
          onChange={filterHandler}
          value={filterList.filterNama}
          name="filterNama"
          className="filter-input form-control"
          placeholder="Nama"
          aria-label="Username"
        />
        <input
          type="text"
          onChange={filterHandler}
          value={filterList.filterNip}
          name="filterNip"
          className="filter-input form-control"
          placeholder="NIP"
          aria-label="Username"
        />
        <input
          type="text"
          onChange={filterHandler}
          value={filterList.filterEmail}
          name="filterEmail"
          className="filter-input form-control"
          placeholder="Email"
          aria-label="Username"
        />
        <button
          onClick={() => filterRender()}
          className="btn btn-primary"
          type="button"
        >
          Search
        </button>
      </div>
      <div className="show-data text-center">
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>NIP</th>
              <th>No. Telp</th>
              <th>Email</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>{renderUser()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
