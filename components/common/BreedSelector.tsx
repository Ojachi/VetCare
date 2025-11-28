import axiosClient from '@/api/axiosClient';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Breed {
  id: number;
  name: string;
  speciesId: number;
  speciesName: string;
  active: boolean;
}

interface BreedSelectorProps {
  speciesId: number | null;
  selectedBreedId: number | null;
  onBreedSelect: (breedId: number, breedName: string) => void;
  placeholder?: string;
}

export const BreedSelector: React.FC<BreedSelectorProps> = ({
  speciesId,
  selectedBreedId,
  onBreedSelect,
  placeholder = 'Seleccionar raza...',
}) => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);

  const loadBreeds = useCallback(async () => {
    if (!speciesId) return;
    try {
      setLoading(true);
      const response = await axiosClient.get(`/api/breeds?speciesId=${speciesId}`);
      const breedList = Array.isArray(response.data) ? response.data : response.data.data || [];
      setBreeds(breedList.filter((b: Breed) => b.active !== false));
      setFilteredBreeds(breedList.filter((b: Breed) => b.active !== false));
      setSearchText('');
    } catch (error) {
      console.error('Error loading breeds:', error);
      setBreeds([]);
      setFilteredBreeds([]);
    } finally {
      setLoading(false);
    }
  }, [speciesId]);

  // Cargar razas cuando cambia especieId
  useEffect(() => {
    if (speciesId) {
      loadBreeds();
    }
  }, [speciesId, loadBreeds]);

  // Buscar la raza seleccionada
  useEffect(() => {
    if (selectedBreedId && breeds.length > 0) {
      const breed = breeds.find(b => b.id === selectedBreedId);
      setSelectedBreed(breed || null);
    }
  }, [selectedBreedId, breeds]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredBreeds(breeds);
    } else {
      const filtered = breeds.filter(breed =>
        breed.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBreeds(filtered);
    }
  };

  const handleSelectBreed = (breed: Breed) => {
    setSelectedBreed(breed);
    onBreedSelect(breed.id, breed.name);
    setShowDropdown(false);
    setSearchText('');
  };

  if (!speciesId) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Selecciona una especie primero</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.selectorText}>
          {selectedBreed?.name || placeholder}
        </Text>
        <Text style={styles.dropdownIcon}>{showDropdown ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar raza..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />

          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />
          ) : filteredBreeds.length > 0 ? (
            <FlatList
              data={filteredBreeds}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.breedItem,
                    selectedBreed?.id === item.id && styles.breedItemSelected,
                  ]}
                  onPress={() => handleSelectBreed(item)}
                >
                  <Text
                    style={[
                      styles.breedItemText,
                      selectedBreed?.id === item.id && styles.breedItemTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>No hay razas disponibles</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginTop: 4,
    maxHeight: 250,
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    fontSize: 14,
    color: '#333',
  },
  loader: {
    padding: 20,
  },
  breedItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  breedItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  breedItemText: {
    fontSize: 14,
    color: '#333',
  },
  breedItemTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  emptyText: {
    padding: 12,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
});
