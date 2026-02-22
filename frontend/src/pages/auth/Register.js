import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import {
  Person,
  Email,
  Lock,
  Phone,
  Visibility,
  VisibilityOff,
  Business,
  AccountCircle,
} from '@mui/icons-material';

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: roleParam === 'establishment' ? 'establishment_admin' : 'client',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'establishment_admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Nettoyer les erreurs au démontage
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    }

    // Nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Téléphone
    if (!formData.phone) {
      newErrors.phone = 'Téléphone requis';
    } else if (!/^(\+?216)?[2-9]\d{7}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide (ex: 21234567)';
    }

    // Mot de passe
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }

    // Confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Conditions générales
    if (!acceptTerms) {
      newErrors.terms = 'Vous devez accepter les conditions générales';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Préparer les données (sans confirmPassword)
    const { confirmPassword, ...userData } = formData;

    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <Card className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h2>
          <p className="text-gray-600">
            {formData.role === 'establishment_admin'
              ? 'Inscrivez votre établissement'
              : 'Rejoignez Lina Beauté aujourd\'hui'}
          </p>
        </div>

        {/* Sélection du type de compte */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'client' }))}
            className={`flex-1 p-4 border-2 rounded-lg transition-all ${
              formData.role === 'client'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 hover:border-purple-300'
            }`}
          >
            <AccountCircle
              className={formData.role === 'client' ? 'text-purple-600' : 'text-gray-400'}
              fontSize="large"
            />
            <p className={`mt-2 font-semibold ${formData.role === 'client' ? 'text-purple-600' : 'text-gray-700'}`}>
              Cliente
            </p>
            <p className="text-xs text-gray-500 mt-1">Réserver des services</p>
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'establishment_admin' }))}
            className={`flex-1 p-4 border-2 rounded-lg transition-all ${
              formData.role === 'establishment_admin'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 hover:border-purple-300'
            }`}
          >
            <Business
              className={formData.role === 'establishment_admin' ? 'text-purple-600' : 'text-gray-400'}
              fontSize="large"
            />
            <p
              className={`mt-2 font-semibold ${
                formData.role === 'establishment_admin' ? 'text-purple-600' : 'text-gray-700'
              }`}
            >
              Établissement
            </p>
            <p className="text-xs text-gray-500 mt-1">Gérer mon salon/spa</p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Erreur globale */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Prénom et Nom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Marie"
              icon={<Person fontSize="small" />}
              error={errors.firstName}
              required
            />

            <Input
              label="Nom"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Dupont"
              icon={<Person fontSize="small" />}
              error={errors.lastName}
              required
            />
          </div>

          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="marie.dupont@email.com"
            icon={<Email fontSize="small" />}
            error={errors.email}
            required
          />

          {/* Téléphone */}
          <Input
            label="Téléphone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="21234567 ou +21621234567"
            icon={<Phone fontSize="small" />}
            error={errors.phone}
            helperText="Format: 21234567 ou +21621234567"
            required
          />

          {/* Mot de passe */}
          <div className="relative">
            <Input
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<Lock fontSize="small" />}
              error={errors.password}
              helperText="6 caractères minimum, avec majuscule, minuscule et chiffre"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </button>
          </div>

          {/* Confirmation mot de passe */}
          <div className="relative">
            <Input
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<Lock fontSize="small" />}
              error={errors.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </button>
          </div>

          {/* Conditions générales */}
          <div>
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: '' }));
                  }
                }}
                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">
                J'accepte les{' '}
                <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                  conditions générales
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
                  politique de confidentialité
                </Link>
              </span>
            </label>
            {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms}</p>}
          </div>

          {/* Bouton d'inscription */}
          <Button type="submit" fullWidth loading={loading} size="lg">
            S'inscrire
          </Button>

          {/* Lien vers connexion */}
          <div className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Se connecter
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;