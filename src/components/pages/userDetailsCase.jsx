import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import Joi from "joi";
import { toast } from "react-toastify";
import Input from "../common/input";
import cardsService from "../../../services/cardsService";

function UserDetailsCase() {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);

  const handleShow = () => setModalShow(true);
  const handleClose = () => setModalShow(false);

  const location = useLocation();
  const {
    title,
    _id,
    subtitle,
    createdAt,
    email,
    description,
    image,
    isOwner,
  } = location.state || {};

  const handleUpdateCard = () => {
    try {
      cardsService.updateCard(_id, form.values);
      toast("Updated seccessfuly", { type: "success" });
      handleClose();
    } catch (err) {
      toast(`Feild to update. error ${err}`, {
        type: "error",
      });
    }
  };

  const handleDeleteCard = async () => {
    try {
      await cardsService.deleteCard(_id);
      navigate("/");
      toast("deleted seccessfuly", { type: "success" });
    } catch (err) {
      toast(`Feild to delete. error ${err}`, {
        type: "error",
      });
    }
  };

  const form = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      title: title,
      subtitle: location.state?.subtitle,
      description: location.state?.description,
      phone: "050444555",
      email: email,
      web: "www.googliloo.com",
      image: {
        url: location.state?.image.url,
        alt: location.state?.image.alt,
      },
      address: {
        state: "new york",
        country: "new jersy",
        city: "new york",
        street: "king street 12",
        houseNumber: "566",
        zip: "6665559",
      },
    },
    validate(values) {
      const schema = Joi.object({
        title: Joi.string().min(2).max(255).required().label("title"),
        subtitle: Joi.string().min(2).max(255).required().label("subtitle"),
        description: Joi.string()
          .min(2)
          .max(1024)
          .required()
          .label("description"),

        phone: Joi.string()
          .min(9)
          .max(11)
          .required()
          .regex(RegExp(/^[0-9]+$/))
          .message("only numbers are allowed")
          .label("Phone"),
        email: Joi.string()
          .min(5)
          .max(255)
          .required()
          .email({ tlds: { allow: false } })
          .label("Email"),
        web: Joi.string().min(14).max(255).label("web address"),
        image: Joi.object({
          url: Joi.string().min(14).label("Image"),
          alt: Joi.string().min(2).max(256).label("Alt"),
        }),
        address: Joi.object({
          state: Joi.string().min(2).max(255).allow("").label("State"),
          country: Joi.string().min(2).max(255).required().label("Country"),
          city: Joi.string().min(2).max(255).required().label("City"),
          street: Joi.string().min(2).max(255).required().label("Street"),
          houseNumber: Joi.string()
            .min(2)
            .max(255)
            .required()
            .label("House Number"),
          zip: Joi.string().min(2).max(255).label("Zip Code"),
        }),
      });

      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) {
        return null;
      }

      const errors = {};
      for (const detail of error.details) {
        const key = detail.path[1] || detail.path[0];
        errors[key] = detail.message;
      }

      return errors;
    },

    async onSubmit(values) {
      try {
        await usersService.updateCard(caseData._id, { ...values });
        toast("card udated", {
          type: "success",
        });
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data);
          toast("Feild to update card", {
            type: "error",
          });
        }
      }
    },
  });
  return (
    <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        show={modalShow}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className=" d-flex justify-content-center align-items-start flex-wrap gap-3 ">
            <img
              src={location.state.image.url}
              alt="court hammer"
              className="img-fluid"
              style={{ maxWidth: "50%", width: "500px", minWidth: "300px" }}
            />
            <form
              onSubmit={form.handleSubmit}
              className="needs-validation"
              noValidate
            >
              <ul
                className="list-group"
                style={{ width: "500px", minWidth: "280px" }}
              >
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <Input
                    {...form.getFieldProps("title")}
                    label={"Case Name"}
                    type="text"
                    required
                    value={form.values.title}
                    error={form.touched.title && form.errors.title}
                  />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <Input
                    label={"Case ID"}
                    type="text"
                    readOnly
                    disabled
                    value={location.state._id}
                  />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <Input
                    {...form.getFieldProps("subtitle")}
                    label={"Client Name"}
                    type="text"
                    required
                    value={form.values.subtitle}
                    error={form.touched.subtitle && form.errors.subtitle}
                  />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <Input
                    label={"Date of Case"}
                    type="text"
                    readOnly
                    disabled
                    value={location.state.createdAt}
                  />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <Input
                    {...form.getFieldProps("email")}
                    label={"Officer In Charge"}
                    type="text"
                    required
                    value={form.values.email}
                    error={form.touched.email && form.errors.email}
                  />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <Input
                    {...form.getFieldProps("description")}
                    label={"Summary"}
                    type="text"
                    required
                    value={form.values.description}
                    error={form.touched.description && form.errors.description}
                  />
                </li>
              </ul>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={!form.isValid}
            onClick={handleUpdateCard}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <main
        className="container-fluid  flex-fill p-3"
        style={{
          background: "#ffebe1",
          minHeight: "fit-content",
        }}
      >
        <div className=" d-flex justify-content-center align-items-start flex-wrap gap-3 ">
          <img
            src={image?.url}
            alt={image?.alt}
            className="img-fluid"
            style={{ maxWidth: "50%", width: "500px", minWidth: "300px" }}
          />
          <ul className="list-group list-group">
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Case Name:</div>
                {form.values.title}
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Case ID</div>
                {_id}
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Client Name</div>
                {form.values.subtitle}
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Date of Case</div>
                {createdAt}
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Officer In Charge</div>
                {form.values.email}
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto" style={{ maxWidth: "300px" }}>
                <div className="fw-bold">Summary</div>
                {form.values.description}
              </div>
            </li>

            {isOwner && (
              <li className="list-group-item">
                <div
                  className="d-flex justify-content-center"
                  style={{ columnGap: "1em" }}
                >
                  <a className="icon-link-hover" onClick={handleShow}>
                    <i className="bi bi-vector-pen h4"></i>
                  </a>
                  <a className="icon-link-hover" onClick={handleDeleteCard}>
                    <i className="bi bi-file-earmark-excel h4"></i>
                  </a>
                </div>
              </li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
}
export default UserDetailsCase;
