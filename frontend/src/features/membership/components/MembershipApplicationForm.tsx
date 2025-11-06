import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { applicationService } from '../services/application.service';
import type { MembershipApplicationData } from '../types/application.types';

export const MembershipApplicationForm = () => {
  const [formData, setFormData] = useState<MembershipApplicationData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
    memberType: 'regular',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    occupation: '',
    interests: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = useMutation({
    mutationFn: (data: MembershipApplicationData) =>
      applicationService.submitApplication(data),
    onSuccess: (response) => {
      console.log('Application submitted successfully:', response);
      setCurrentStep(4); // Success step
    },
    onError: (error) => {
      const err = error as { response?: { data?: { errors?: Array<{ field: string; message: string }> } } };
      console.error('Error submitting application:', error);
      if (err.response?.data?.errors) {
        const newErrors: Record<string, string> = {};
        err.response.data.errors.forEach((e) => {
          newErrors[e.field] = e.message;
        });
        setErrors(newErrors);
      }
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof MembershipApplicationData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';
      if (!formData.email) newErrors.email = "L'email est requis";
      if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
    } else if (step === 2) {
      if (!formData.address.city) newErrors['address.city'] = 'La ville est requise';
      if (!formData.address.postalCode)
        newErrors['address.postalCode'] = 'Le code postal est requis';
    } else if (step === 3) {
      if (!formData.emergencyContact.name)
        newErrors['emergencyContact.name'] = 'Le nom du contact est requis';
      if (!formData.emergencyContact.phone)
        newErrors['emergencyContact.phone'] = 'Le téléphone du contact est requis';
      if (!formData.emergencyContact.relationship)
        newErrors['emergencyContact.relationship'] = 'La relation est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      submitMutation.mutate(formData);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Informations personnelles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de naissance <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+261 34 56 789 01"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type d'adhésion
        </label>
        <select
          name="memberType"
          value={formData.memberType}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="regular">Régulier</option>
          <option value="student">Étudiant</option>
          <option value="family">Famille</option>
          <option value="honorary">Honoraire</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Adresse</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rue / Numéro
        </label>
        <input
          type="text"
          name="address.street"
          value={formData.address.street}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors['address.city'] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors['address.city'] && (
            <p className="mt-1 text-sm text-red-500">{errors['address.city']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code postal <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address.postalCode"
            value={formData.address.postalCode}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors['address.postalCode'] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors['address.postalCode'] && (
            <p className="mt-1 text-sm text-red-500">
              {errors['address.postalCode']}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pays
        </label>
        <input
          type="text"
          name="address.country"
          value={formData.address.country}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profession (optionnel)
        </label>
        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Centres d'intérêt (optionnel)
        </label>
        <textarea
          name="interests"
          value={formData.interests}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Contact d'urgence
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="emergencyContact.name"
          value={formData.emergencyContact.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors['emergencyContact.name'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors['emergencyContact.name'] && (
          <p className="mt-1 text-sm text-red-500">
            {errors['emergencyContact.name']}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="emergencyContact.phone"
          value={formData.emergencyContact.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors['emergencyContact.phone'] ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+261 34 56 789 01"
        />
        {errors['emergencyContact.phone'] && (
          <p className="mt-1 text-sm text-red-500">
            {errors['emergencyContact.phone']}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relation <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="emergencyContact.relationship"
          value={formData.emergencyContact.relationship}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors['emergencyContact.relationship']
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
          placeholder="Ex: Père, Mère, Conjoint(e), Ami(e)"
        />
        {errors['emergencyContact.relationship'] && (
          <p className="mt-1 text-sm text-red-500">
            {errors['emergencyContact.relationship']}
          </p>
        )}
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Demande envoyée avec succès !
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Votre demande d'adhésion a été soumise. Vous recevrez une réponse par email
        dans les plus brefs délais.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retour à l'accueil
      </button>
    </div>
  );

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {renderSuccessStep()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Demande d'Adhésion
            </h1>
            <p className="text-gray-600">
              Rejoignez l'association Madagasikara Hoan'ny Malagasy
            </p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Error Message */}
            {submitMutation.isError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">
                  {(submitMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                    'Une erreur est survenue. Veuillez réessayer.'}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Soumettre ma demande'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
