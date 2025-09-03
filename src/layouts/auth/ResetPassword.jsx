import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

const ResetPassword = () => {
    const resetSchema = Yup.object({
        password: Yup.string()
        .min(6, "Mínimo 6 caracteres")
        .required("La contraseña es requerida"),
        confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Repetí la contraseña"),
    });

    const { resetPassword } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({ token: "", id: "" });

    useEffect(() => {
        const url = new URLSearchParams(window.location.search);
        setParams({
        token: url.get("token") || "",
        id: url.get("id") || "",
        });
    }, []);

    const invalidLink = !params.token || !params.id;

    return (
        <Card title="Nueva contraseña">
        {invalidLink ? (
            <h5>Enlace inválido o incompleto</h5>
        ) : (
            <Formik
            initialValues={{ password: "", confirm: "" }}
            validationSchema={resetSchema}
            onSubmit={async (values, { resetForm }) => {
                try {
                setLoading(true);
                const response = await resetPassword({
                    id: params.id,
                    token: params.token,
                    password: values.password,
                });

                if (response) {
                    resetForm();
                    navigate("/inicio-sesion");
                }
                } catch (error) {
                console.error("Error al resetear contraseña:", error);
                } finally {
                setLoading(false);
                }
            }}
            >
            {({ values, handleChange, handleBlur }) => (
                <Form className="p-fluid">
                <label htmlFor="password">Nueva contraseña</label>
                <Password
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    feedback={false}
                    placeholder="Nueva contraseña"
                />
                <ErrorMessage
                    name="password"
                    component="small"
                    className="p-error"
                />

                <label htmlFor="confirm" className="mt-3">
                    Repetir contraseña
                </label>
                <Password
                    id="confirm"
                    name="confirm"
                    value={values.confirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    feedback={false}
                    placeholder="Repetir contraseña"
                />
                <ErrorMessage
                    name="confirm"
                    component="small"
                    className="p-error"
                />

                <Button
                    type="submit"
                    label="Cambiar contraseña"
                    className="mt-4"
                    icon={loading ? "pi pi-spin pi-spinner" : "pi pi-send"}
                    disabled={loading}
                />
                </Form>
            )}
            </Formik>
        )}
        </Card>
    );
};

export default ResetPassword;
